import argon2 from "argon2"
import db from "#config/db"
import jwt from "jsonwebtoken"
import jwtConfig from "#config/jwt"

const { secret, refreshSecret, accessExpiresIn, refreshExpiresIn } = jwtConfig

const generateTokens = (user) => {
    const payload = {
        id: user.id,
        role: user.role,
    }

    const accessToken = jwt.sign(payload, secret, {
        expiresIn: accessExpiresIn,
    })

    const refreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: refreshExpiresIn,
    })

    return { accessToken, refreshToken }
}

const register = async (req, res) => {
    try {
        let { username, email, password } = req.body
        email = email?.toLowerCase().trim()
        username = username?.trim()
        password = password?.trim()

        if (!username || username.length < 3 || username.length > 30) {
            return res.status(400).json({ message: "Username must be 3-30 characters" })
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email address" })
        }

        if (!password || password.length < 8 || password.length > 128) {
            return res.status(400).json({ message: "Password must be 8-128 characters" })
        }

        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id })
        await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword])

        res.status(201).json({ message: "User registered successfully" })
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already registered" })
        }

        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}
const refresh = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" })
    }

    try {
        const decoded = jwt.verify(refreshToken, secret)

        const [sessions] = await db.query("SELECT * FROM sessions WHERE user_id = ? AND revoked = FALSE", [decoded.id])

        if (sessions.length === 0) {
            return res.status(401).json({ message: "Invalid refresh token" })
        }

        let validSession = null

        for (const session of sessions) {
            const valid = await argon2.verify(session.refresh_token_hash, refreshToken)

            if (valid) {
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

        const [users] = await db.query("SELECT id, role FROM users WHERE id = ?", [decoded.id])

        const user = users[0]
        const tokens = generateTokens(user)

        const newRefreshHash = await argon2.hash(tokens.refreshToken)
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        await db.query("INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)", [user.id, newRefreshHash, newExpiresAt])

        res.json(tokens)
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email])

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const user = rows[0]

        const valid = await argon2.verify(user.password, password)
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const tokens = generateTokens(user)
        const refreshHash = await argon2.hash(tokens.refreshToken)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        await db.query("INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)", [user.id, refreshHash, expiresAt])

        res.json(tokens)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

export { register, login, refresh, generateTokens }
