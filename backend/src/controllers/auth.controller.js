import * as z from "zod"

import User from "#models/user.model"
import Session from "#models/session.model"
import Audit from "#services/audit.service"
import {
	generateAccessToken,
	generateTokens,
	revokeRefreshSession,
	validateRefreshSession,
} from "#services/auth.service"
import logger from "#utils/logger.utils"

const register = async (req, res) => {
	if (!req.body) return res.status(400).json({ code: "AUTH_NO_DATA_PROVIDED" })

	try {
		let { username, email, password } = req.body

		if (!username || !email || !password)
			return res.status(400).json({
				code: "AUTH_MISSING_FIELDS",
			})

		email = email?.toLowerCase().trim()

		const registerSchema = z.object({
			username: z.string().min(3, { message: "Invalid username" }),
			email: z.string().email({ message: "Invalid email" }),
			password: z.string().min(8, { message: "Password too short" }),
		})

		const result = registerSchema.safeParse({ username, email, password })
		if (!result.success) {
			const issue = result.error.issues[0]
			const path = issue.path && issue.path.length ? issue.path[0] : null

			let code = "AUTH_INVALID_INPUT"
			if (path === "username") code = "AUTH_INVALID_USERNAME"
			if (path === "email") code = "AUTH_INVALID_EMAIL"
			if (path === "password") code = "AUTH_PASSWORD_TOO_SHORT"

			return res.status(400).json({ code, message: issue.message })
		}

		const userId = await User.createUser({ username, email, password })

		const deviceInfo = Audit.getUserAgentRaw(req)
		Audit.createAudit({
			user_id: userId,
			action: "USER_REGISTER",
			details: { username, email, date: new Date().toISOString() },
			ip_address: Audit.getClientIp(req),
			user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
		})

		res.status(201).json({
			code: "AUTH_USER_REGISTERED",
		})
	} catch (err) {
		if (err && (err.code === "ER_DUP_ENTRY" || err.code === "23505"))
			return res.status(409).json({
				code: "AUTH_EMAIL_ALREADY_REGISTERED",
			})

		logger.error(err)
		res.status(500).json({ code: "SERVER_ERROR" })
	}
}

const login = async (req, res) => {
	if (!req.body) return res.status(400).json({ code: "AUTH_NO_DATA_PROVIDED" })

	const { email, password } = req.body

	if (!email || !password)
		return res.status(400).json({
			code: "AUTH_MISSING_FIELDS",
		})

	try {
		const user = await User.findUserByEmail(email)
		if (!user || !(await User.verifyPassword(user.password, password))) {
			return res.status(401).json({ code: "AUTH_INVALID_CREDENTIALS" })
		}

		const tokens = generateTokens(user)
		const deviceInfo = Audit.getUserAgentRaw(req)

		await Session.createSession(user.id, tokens.refreshToken, deviceInfo ? JSON.stringify(deviceInfo.raw) : null)

		if (user.role === "admin") {
			Audit.createAudit({
				user_id: user.id,
				action: "ADMIN_ACTION",
				details: { type: "ADMIN_LOGIN", date: new Date().toISOString(), username: user.username },
				ip_address: Audit.getClientIp(req),
				user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
			})
		}

		res.json(tokens)
	} catch (err) {
		res.status(500).json({ code: "SERVER_ERROR" })
	}
}

const refresh = async (req, res) => {
	const { refreshToken } = req.body
	if (!refreshToken) return res.status(401).json({ code: "AUTH_NO_TOKEN_PROVIDED" })

	try {
		const result = await validateRefreshSession(refreshToken)

		if (result.code) {
			return res.status(401).json({ code: result.code })
		}

		res.json({
			accessToken: generateAccessToken(result.user),
			refreshToken,
		})
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			await revokeRefreshSession(refreshToken)
		}

		res.status(401).json({
			code: "AUTH_INVALID_REFRESH_TOKEN",
		})
	}
}

export { register, login, refresh, generateAccessToken, generateTokens }
