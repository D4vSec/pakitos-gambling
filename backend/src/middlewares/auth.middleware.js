import jwt from "jsonwebtoken"
import jwtConfig from "#config/jwt.config"
import User from "#models/user.model"
import Session from "#models/session.model"
import { generateTokens } from "#controllers/auth.controller"

const { secret, refreshSecret } = jwtConfig

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization
	const refreshToken = req.headers["x-refresh-token"]

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ code: "AUTH_NO_TOKEN_PROVIDED" })
	}

	const accessToken = authHeader.split(" ")[1]

	try {
		const decoded = jwt.verify(accessToken, secret)
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
				const decodedRefresh = jwt.verify(refreshToken, refreshSecret)
				const sessions = await Session.getActiveSessionsByUserId(decodedRefresh.id)

				const validSession = await Session.verifyTokenMatch(sessions, refreshToken)

				if (!validSession || new Date(validSession.expires_at) < new Date()) {
					return res.status(401).json({
						code: "AUTH_INVALID_SESSION",
					})
				}

				await Session.revokeSession(validSession.id)
				const user = await User.findUserById(decodedRefresh.id)
				const tokens = generateTokens(user)

				await Session.createSession(user.id, tokens.refreshToken, req.useragent ? JSON.stringify({ browser: req.useragent.browser, version: req.useragent.version, os: req.useragent.os, platform: req.useragent.platform, isMobile: req.useragent.isMobile, isTablet: req.useragent.isTablet, isDesktop: req.useragent.isDesktop }) : null)

				req.user = { id: user.id, role: user.role }
				res.setHeader("x-access-token", tokens.accessToken)
				res.setHeader("x-refresh-token", tokens.refreshToken)

				return next()
			} catch (refreshErr) {
				return res.status(401).json({ code: "AUTH_SESSION_EXPIRED" })
			}
		}

		return res.status(401).json({ code: "AUTH_INVALID_TOKEN" })
	}
}

export default authMiddleware
