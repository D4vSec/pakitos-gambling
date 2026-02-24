import db from "#config/db"
import { hashPassword, comparePassword } from "#utils/password"

const createSession = async (userId, refreshToken) => {
    const refreshHash = await hashPassword(refreshToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await db.query("INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)", [userId, refreshHash, expiresAt])
}

const getActiveSessionsByUserId = async (userId) => {
    const [rows] = await db.query("SELECT * FROM sessions WHERE user_id = ? AND revoked = FALSE", [userId])
    return rows
}

const revokeSession = async (sessionId) => {
    await db.query("UPDATE sessions SET revoked = TRUE WHERE id = ?", [sessionId])
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
    revokeSession,
    verifyTokenMatch,
}