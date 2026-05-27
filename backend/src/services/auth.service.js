import jwt from "jsonwebtoken"

import jwtConfig from "#config/jwt.config"
import Session from "#models/session.model"
import User from "#models/user.model"

const { secret, refreshSecret, accessExpiresIn, refreshExpiresIn } = jwtConfig

const generateAccessToken = (user) => {
	const payload = { id: user.id, role: user.role }
	return jwt.sign(payload, secret, { expiresIn: accessExpiresIn })
}

const generateRefreshToken = (user) => {
	const payload = { id: user.id }
	return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn })
}

const generateTokens = (user) => ({
	accessToken: generateAccessToken(user),
	refreshToken: generateRefreshToken(user),
})

const findRefreshSession = async (userId, refreshToken) => {
	const sessions = await Session.getActiveSessionsByUserId(userId)
	return Session.verifyTokenMatch(sessions, refreshToken)
}

const validateRefreshSession = async (refreshToken) => {
	const decoded = jwt.verify(refreshToken, refreshSecret)
	const validSession = await findRefreshSession(decoded.id, refreshToken)

	if (!validSession) {
		return { code: "AUTH_INVALID_SESSION" }
	}

	if (new Date(validSession.expires_at) < new Date()) {
		await Session.revokeSession(validSession.id)
		return { code: "AUTH_SESSION_EXPIRED" }
	}

	const user = await User.findUserById(decoded.id)

	if (!user) {
		return { code: "AUTH_INVALID_SESSION" }
	}

	return { user, session: validSession }
}

const revokeRefreshSession = async (refreshToken) => {
	const decoded = jwt.decode(refreshToken)

	if (!decoded || typeof decoded !== "object" || !decoded.id) {
		return
	}

	const validSession = await findRefreshSession(decoded.id, refreshToken)

	if (validSession) {
		await Session.revokeSession(validSession.id)
	}
}

export { generateAccessToken, generateRefreshToken, generateTokens, validateRefreshSession, revokeRefreshSession }
