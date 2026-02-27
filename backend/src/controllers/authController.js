import jwt from "jsonwebtoken"
import * as z from "zod"

import jwtConfig from "#config/jwt"
import User from "#models/userModel"
import Session from "#models/sessionModel"

const { secret, refreshSecret, accessExpiresIn, refreshExpiresIn } = jwtConfig

const generateTokens = (user) => {
	const payload = { id: user.id }
	const accessToken = jwt.sign(payload, secret, { expiresIn: accessExpiresIn })
	const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn })
	return { accessToken, refreshToken }
}

const register = async (req, res) => {
	if (!req.body)
		return res.status(400).json({ code: "AUTH_NO_DATA_PROVIDED", message: "No data provided" })

	try {
		let { username, email, password } = req.body

		if (!username || !email || !password)
			return res.status(400).json({
				code: "AUTH_MISSING_FIELDS",
				message: "Username, email, and password are required",
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

		await User.createUser({ username, email, password })

		res.status(201).json({
			code: "AUTH_USER_REGISTERED",
			message: "User registered successfully",
		})
	} catch (err) {
		if (err && (err.code === "ER_DUP_ENTRY" || err.code === "23505"))
			return res.status(409).json({
				code: "AUTH_EMAIL_ALREADY_REGISTERED",
				message: "Email already registered",
			})

		console.error(err)
		res.status(500).json({ code: "AUTH_SERVER_ERROR", message: "Server error" })
	}
}

const login = async (req, res) => {
	if (!req.body)
		return res.status(400).json({ code: "AUTH_NO_DATA_PROVIDED", message: "No data provided" })

	const { email, password } = req.body

	if (!email || !password)
		return res.status(400).json({
			code: "AUTH_MISSING_FIELDS",
			message: "Email, and password are required",
		})

	try {
		const user = await User.findUserByEmail(email)
		if (!user || !(await User.verifyPassword(user.password, password))) {
			return res
				.status(401)
				.json({ code: "AUTH_INVALID_CREDENTIALS", message: "Invalid credentials" })
		}

		const tokens = generateTokens(user)
		await Session.createSession(user.id, tokens.refreshToken)
		res.json(tokens)
	} catch (err) {
		res.status(500).json({ message: "Server error" })
	}
}

const refresh = async (req, res) => {
	const { refreshToken } = req.body
	if (!refreshToken)
		return res
			.status(401)
			.json({ code: "AUTH_NO_TOKEN_PROVIDED", message: "No token provided" })

	try {
		const decoded = jwt.verify(refreshToken, refreshSecret)
		const sessions = await Session.getActiveSessionsByUserId(decoded.id)
		const validSession = await Session.verifyTokenMatch(sessions, refreshToken)

		if (!validSession || new Date(validSession.expires_at) < new Date()) {
			return res
				.status(401)
				.json({ code: "AUTH_INVALID_SESSION", message: "Invalid or expired session" })
		}

		await Session.revokeSession(validSession.id)
		const user = await User.findUserById(decoded.id)
		const tokens = generateTokens(user)
		await Session.createSession(user.id, tokens.refreshToken)

		res.json(tokens)
	} catch (err) {
		res.status(401).json({
			code: "AUTH_INVALID_REFRESH_TOKEN",
			message: "Invalid refresh token",
		})
	}
}

export { register, login, refresh, generateTokens }
