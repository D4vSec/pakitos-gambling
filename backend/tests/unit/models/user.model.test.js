import { beforeEach, describe, expect, it, vi } from 'vitest'

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
import userModel from '../../../src/models/user.model.js'

describe('user model list queries', () => {
	const userId = '11111111-1111-1111-1111-111111111111'

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('supports filtered and sorted transaction queries', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: 'tx-1', amount: 15, type: 'BET' }] })

		await expect(
			userModel.findTransactionsByUser(userId, 1, 20, {
				type: ['BET', 'WIN'],
				minAmount: '10',
				maxAmount: '50',
				fromDate: '2026-05-01',
				toDate: '2026-05-08',
				columns: ['id', 'amount', 'type'],
				sortBy: 'amount',
				sortOrder: 'asc',
			}),
		).resolves.toEqual([{ id: 'tx-1', amount: 15, type: 'BET' }])

		expect(db.query).toHaveBeenCalledWith(
			'SELECT id, amount, type FROM transactions WHERE user_id = $1 AND type IN ($2, $3) AND created_at >= $4 AND created_at <= $5 AND amount >= $6 AND amount <= $7 ORDER BY amount ASC LIMIT $8 OFFSET $9',
			[
				userId,
				'BET',
				'WIN',
				'2026-05-01T00:00:00.000Z',
				'2026-05-08T23:59:59.999Z',
				10,
				50,
				20,
				0,
			],
		)
	})

	it('returns no users for invalid UUID filters without hitting PostgreSQL uuid casts', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ count: 0 }] })

		await expect(userModel.countUsers({ userId: 'abc' })).resolves.toBe(0)

		expect(db.query).toHaveBeenCalledWith(
			'SELECT COUNT(*)::int AS count FROM users WHERE 1 = 0',
			[],
		)
	})

	it('supports reusable user filters, selected columns and sorting', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: userId, email: 'admin@example.com' }] })

		await expect(
			userModel.findUsers(1, 20, {
				role: ['admin', 'user'],
				columns: ['id', 'email'],
				sortBy: 'email',
				sortOrder: 'desc',
				filterField: 'username',
				filterValue: 'dav',
			}),
		).resolves.toEqual([{ id: userId, email: 'admin@example.com' }])

		expect(db.query).toHaveBeenCalledWith(
			"SELECT id, email FROM users WHERE role IN ($1, $2) AND (username ILIKE $3 ESCAPE '\\') ORDER BY email DESC LIMIT $4 OFFSET $5",
			['admin', 'user', '%dav%', 20, 0],
		)
	})
})
