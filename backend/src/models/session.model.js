import db from "#config/db.config"
import jwtConfig from "#config/jwt.config"
import { hashPassword, comparePassword } from "#utils/password.utils"

const { refreshExpiresIn } = jwtConfig

const parseExpiresInToMs = (expiresIn) => {
	if (typeof expiresIn === "number") {
		return expiresIn
	}

	if (typeof expiresIn !== "string") {
		throw new TypeError("Invalid refresh token expiration format")
	}

	const match = expiresIn.trim().match(/^(\d+)([smhd])$/i)

	if (!match) {
		throw new Error(`Unsupported refresh token expiration: ${expiresIn}`)
	}

	const [, rawValue, rawUnit] = match
	const value = Number(rawValue)
	const unit = rawUnit.toLowerCase()
	const unitsInMs = {
		s: 1000,
		m: 60 * 1000,
		h: 60 * 60 * 1000,
		d: 24 * 60 * 60 * 1000,
	}

	return value * unitsInMs[unit]
}

const createSession = async (userId, refreshToken, deviceInfo = null) => {
	const refreshHash = await hashPassword(refreshToken)
	const expiresAt = new Date(Date.now() + parseExpiresInToMs(refreshExpiresIn))
	if (deviceInfo === null || deviceInfo === undefined) {
		await db.query(
			"INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES ($1, $2, $3)",
			[userId, refreshHash, expiresAt],
		)
	} else {
		await db.query(
			"INSERT INTO sessions (user_id, refresh_token_hash, device_info, expires_at) VALUES ($1, $2, $3, $4)",
			[userId, refreshHash, deviceInfo, expiresAt],
		)
	}
}

const getActiveSessionsByUserId = async (userId) => {
	const { rows } = await db.query(
		"SELECT * FROM sessions WHERE user_id = $1 AND revoked = false",
		[userId],
	)
	return rows
}

const getSessionsByUserId = async (userId) => {
	const { rows } = await db.query(
		"SELECT id, user_id, device_info, revoked, expires_at, created_at FROM sessions WHERE user_id = $1 ORDER BY created_at DESC",
		[userId],
	)
	return rows
}

const revokeSession = async (sessionId) => {
	await db.query("UPDATE sessions SET revoked = true WHERE id::text = $1", [String(sessionId)])
}

const revokeSessionByUserId = async (userId, sessionId) => {
	const { rowCount } = await db.query(
		"UPDATE sessions SET revoked = true WHERE user_id = $1 AND id::text = $2 AND revoked = false",
		[userId, String(sessionId)],
	)
	return rowCount > 0
}

const revokeSessionsByUserId = async (userId) => {
	await db.query("UPDATE sessions SET revoked = true WHERE user_id = $1 AND revoked = false", [userId])
}

const verifyTokenMatch = async (sessions, refreshToken) => {
	for (const session of sessions) {
		const isMatch = await comparePassword(session.refresh_token_hash, refreshToken)
		if (isMatch) return session
	}
	return null
}

export default {
	createSession,
	getActiveSessionsByUserId,
	getSessionsByUserId,
	revokeSession,
	revokeSessionByUserId,
	revokeSessionsByUserId,
	verifyTokenMatch,
}
