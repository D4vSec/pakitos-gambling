import jwt from "jsonwebtoken"
import * as z from "zod"

import jwtConfig from "#config/jwt"
import User from "#models/userModel"
import Session from "#models/sessionModel"

const { secret, refreshSecret, accessExpiresIn, refreshExpiresIn } = jwtConfig

const generateTokens = (user) => {
	const payload = { id: user.id, role: user.role }
	const accessToken = jwt.sign(payload, secret, { expiresIn: accessExpiresIn })
	const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn })
	return { accessToken, refreshToken }
}

const register = async (req, res) => {
	try {
		let { username, email, password } = req.body
		email = email?.toLowerCase().trim()

		const registerSchema = z.object({
			username: z
				.string()
				.min(3, { code: "AUTH_INVALID_USERNAME", message: "Invalid username" }),
			email: z.string().email({ code: "AUTH_INVALID_EMAIL", message: "Invalid email" }),
			password: z
				.string()
				.min(8, { code: "AUTH_PASSWORD_TOO_SHORT", message: "Password too short" }),
		})

		const result = registerSchema.safeParse({ username, email, password })
		if (!result.success) {
			const message = result.error.errors[0]?.message || "Invalid input"
			return res.status(400).json({ message })
		}

		await User.createUser({ username, email, password })
		res.status(201).json({
			code: "AUTH_USER_REGISTERED",
			message: "User registered successfully",
		})
	} catch (err) {
		if (err.code === "ER_DUP_ENTRY")
			return res.status(409).json({
				code: "AUTH_EMAIL_ALREADY_REGISTERED",
				message: "Email already registered",
			})
		res.status(500).json({ code: "AUTH_SERVER_ERROR", message: "Server error" })
	}
}

const login = async (req, res) => {
	const { email, password } = req.body
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
