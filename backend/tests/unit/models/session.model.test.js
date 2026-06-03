import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#config/db.config', () => ({
	default: {
		query: vi.fn(),
	},
}))

vi.mock('#utils/password.utils', () => ({
	hashPassword: vi.fn(),
	comparePassword: vi.fn(),
}))

import db from '#config/db.config'
import { comparePassword, hashPassword } from '#utils/password.utils'
import sessionModel from '../../../src/models/session.model.js'

describe('session model', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-05-27T10:00:00.000Z'))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('creates sessions with the same lifetime as the refresh token', async () => {
		hashPassword.mockResolvedValueOnce('hashed-refresh')
		db.query.mockResolvedValueOnce({ rows: [] })

		await sessionModel.createSession('user-1', 'refresh-token')

		expect(hashPassword).toHaveBeenCalledWith('refresh-token')
		expect(db.query).toHaveBeenCalledWith(
			'INSERT INTO sessions (user_id, refresh_token_hash, expires_at) VALUES ($1, $2, $3)',
			['user-1', 'hashed-refresh', new Date('2026-07-26T10:00:00.000Z')],
		)
	})

	it('matches refresh tokens against active session hashes', async () => {
		comparePassword.mockResolvedValueOnce(false).mockResolvedValueOnce(true)

		await expect(
			sessionModel.verifyTokenMatch(
				[
					{ id: 'session-1', refresh_token_hash: 'hash-1' },
					{ id: 'session-2', refresh_token_hash: 'hash-2' },
				],
				'refresh-token',
			),
		).resolves.toEqual({ id: 'session-2', refresh_token_hash: 'hash-2' })

		expect(comparePassword).toHaveBeenNthCalledWith(1, 'hash-1', 'refresh-token')
		expect(comparePassword).toHaveBeenNthCalledWith(2, 'hash-2', 'refresh-token')
	})

	it('lists user sessions without refresh token hashes', async () => {
		const rows = [{ id: 'session-1', user_id: 'user-1', revoked: false }]
		db.query.mockResolvedValueOnce({ rows })

		await expect(sessionModel.getSessionsByUserId('user-1')).resolves.toEqual(rows)

		expect(db.query).toHaveBeenCalledWith(
			'SELECT id, user_id, device_info, revoked, expires_at, created_at FROM sessions WHERE user_id = $1 ORDER BY created_at DESC',
			['user-1'],
		)
	})

	it('revokes a user session by user and session id', async () => {
		db.query.mockResolvedValueOnce({ rowCount: 1 })

		await expect(sessionModel.revokeSessionByUserId('user-1', 'session-1')).resolves.toBe(true)

		expect(db.query).toHaveBeenCalledWith(
			'UPDATE sessions SET revoked = true WHERE user_id = $1 AND id::text = $2 AND revoked = false',
			['user-1', 'session-1'],
		)
	})
})
