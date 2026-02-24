import jwt from "jsonwebtoken"
import argon2 from "argon2"
import db from "#config/db"
import jwtConfig from "#config/jwt"
import { generateTokens } from "#controllers/authController"

const { secret, refreshSecret } = jwtConfig

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const refreshToken = req.headers["x-refresh-token"]

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No access token provided" })
    }

    const accessToken = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(accessToken, secret)
        req.user = decoded
        return next()
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            if (!refreshToken) {
                return res.status(401).json({ message: "Access token expired, no refresh token provided" })
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, refreshSecret)

                const [sessions] = await db.query("SELECT * FROM sessions WHERE user_id = ? AND revoked = FALSE", [decodedRefresh.id])

                if (!sessions || sessions.length === 0) {
                    return res.status(401).json({ message: "Invalid refresh token" })
                }

                let validSession = null
                for (const session of sessions) {
                    if (await argon2.verify(session.refresh_token_hash, refreshToken)) {
                        validSession = session
                        break
                    }
                }

                if (!validSession) {
                    return res.status(401).json({ message: "Invalid refresh token" })
                }

                if (new Date(validSession.expires_at) < new Date()) {
                    return res.status(401).json({ message: "Refresh token expired" })
                }

                await db.query("UPDATE sessions SET revoked = TRUE WHERE id = ?", [validSession.id])

                const [users] = await db.query("SELECT id, role FROM users WHERE id = ?", [decodedRefresh.id])
                const user = users[0]
                const tokens = generateTokens(user)

                const refreshHash = await argon2.hash(tokens.refreshToken)
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                await db.query("INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)", [user.id, refreshHash, expiresAt])

                req.user = { id: user.id, role: user.role }
                res.setHeader("x-access-token", tokens.accessToken)
                res.setHeader("x-refresh-token", tokens.refreshToken)

                return next()
            } catch (refreshErr) {
                console.error(refreshErr)
                return res.status(401).json({ message: "Invalid or expired refresh token" })
            }
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid access token" })
        }

        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

export default authMiddleware
