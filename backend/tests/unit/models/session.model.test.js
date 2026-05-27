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
})
