import db from "#config/db.config"
import { hashPassword, comparePassword } from "#utils/password"

const createSession = async (userId, refreshToken, deviceInfo = null) => {
	const refreshHash = await hashPassword(refreshToken)
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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

const revokeSession = async (sessionId) => {
	await db.query("UPDATE sessions SET revoked = true WHERE id = $1", [sessionId])
}

const verifyTokenMatch = async (sessions, refreshToken) => {
	for (const session of sessions) {
		const isMatch = await comparePassword(session.refresh_token_hash, refreshToken)
		if (isMatch) return session
	}
	return null
}

export default { createSession, getActiveSessionsByUserId, revokeSession, verifyTokenMatch }
