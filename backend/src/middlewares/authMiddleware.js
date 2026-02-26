import jwt from "jsonwebtoken"
import jwtConfig from "#config/jwt"
import User from "#models/userModel"
import Session from "#models/sessionModel"
import { generateTokens } from "#controllers/authController"

const { secret, refreshSecret } = jwtConfig

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization
	const refreshToken = req.headers["x-refresh-token"]

	if (!authHeader?.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ code: "AUTH_NO_TOKEN_PROVIDED", message: "No access token provided" })
	}

	const accessToken = authHeader.split(" ")[1]

	try {
		const decoded = jwt.verify(accessToken, secret)
		req.user = decoded
		return next()
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			if (!refreshToken) {
				return res
					.status(401)
					.json({ code: "AUTH_NO_TOKEN_PROVIDED", message: "No token provided" })
			}

			try {
				const decodedRefresh = jwt.verify(refreshToken, refreshSecret)
				const sessions = await Session.getActiveSessionsByUserId(decodedRefresh.id)

				const validSession = await Session.verifyTokenMatch(sessions, refreshToken)

				if (!validSession || new Date(validSession.expires_at) < new Date()) {
					return res.status(401).json({
						code: "AUTH_INVALID_SESSION",
						message: "Invalid or expired session",
					})
				}

				await Session.revokeSession(validSession.id)
				const user = await User.findUserById(decodedRefresh.id)
				const tokens = generateTokens(user)

				await Session.createSession(user.id, tokens.refreshToken)

				req.user = { id: user.id, role: user.role }
				res.setHeader("x-access-token", tokens.accessToken)
				res.setHeader("x-refresh-token", tokens.refreshToken)

				return next()
			} catch (refreshErr) {
				return res
					.status(401)
					.json({ code: "AUTH_SESSION_EXPIRED", message: "Session expired" })
			}
		}

		return res.status(401).json({ code: "AUTH_INVALID_TOKEN", message: "Invalid token" })
	}
}

export default authMiddleware
