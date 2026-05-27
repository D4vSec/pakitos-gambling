import jwt from "jsonwebtoken"
import jwtConfig from "#config/jwt.config"
import User from "#models/user.model"
import {
	generateAccessToken,
	revokeRefreshSession,
	validateRefreshSession,
} from "#services/auth.service"

const { secret } = jwtConfig

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization
	const refreshToken = req.headers["x-refresh-token"]

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ code: "AUTH_NO_TOKEN_PROVIDED" })
	}

	const accessToken = authHeader.split(" ")[1]

	try {
		const decoded = jwt.verify(accessToken, secret)
		if (decoded?.id && decoded?.role) {
			req.user = { id: decoded.id, role: decoded.role }
			return next()
		}

		const user = await User.findUserById(decoded.id)

		if (!user) {
			return res.status(401).json({ code: "AUTH_INVALID_TOKEN" })
		}

		req.user = { id: user.id, role: user.role }
		return next()
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			if (!refreshToken) {
				return res.status(401).json({ code: "AUTH_NO_TOKEN_PROVIDED" })
			}

			try {
				const result = await validateRefreshSession(refreshToken)

				if (result.code) {
					return res.status(401).json({ code: result.code })
				}

				req.user = { id: result.user.id, role: result.user.role }
				res.setHeader("x-access-token", generateAccessToken(result.user))
				res.setHeader("x-refresh-token", refreshToken)

				return next()
			} catch (refreshErr) {
				if (refreshErr.name === "TokenExpiredError") {
					await revokeRefreshSession(refreshToken)
				}

				return res.status(401).json({ code: "AUTH_SESSION_EXPIRED" })
			}
		}

		return res.status(401).json({ code: "AUTH_INVALID_TOKEN" })
	}
}

export default authMiddleware
