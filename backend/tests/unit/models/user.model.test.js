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
import { comparePassword, hashPassword } from '#utils/password.utils'
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
				'2026-05-01 00:00:00.000',
				'2026-05-08 23:59:59.999',
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

describe('user model basic accessors', () => {
	const userId = '11111111-1111-1111-1111-111111111111'

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('creates users with a hashed password', async () => {
		hashPassword.mockResolvedValueOnce('hashed-password')
		db.query.mockResolvedValueOnce({ rows: [{ id: userId }] })

		await expect(
			userModel.createUser({
				username: 'demo',
				email: 'demo@example.com',
				password: 'secret123',
			}),
		).resolves.toBe(userId)

		expect(hashPassword).toHaveBeenCalledWith('secret123')
		expect(db.query).toHaveBeenCalledWith(
			'INSERT INTO users (username, email, password, role, balance) VALUES ($1, $2, $3, $4, $5) RETURNING id',
			['demo', 'demo@example.com', 'hashed-password', 'user', 0],
		)
	})

	it('finds users by email', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: userId, email: 'demo@example.com' }] })

		await expect(userModel.findUserByEmail('demo@example.com')).resolves.toEqual({
			id: userId,
			email: 'demo@example.com',
		})
	})

	it('returns null for invalid user ids without querying postgres', async () => {
		await expect(userModel.findUserById('bad-id')).resolves.toBeNull()

		expect(db.query).not.toHaveBeenCalled()
	})

	it('finds users by id', async () => {
		db.query.mockResolvedValueOnce({
			rows: [{ id: userId, username: 'demo', email: 'demo@example.com', role: 'user', balance: 10 }],
		})

		await expect(userModel.findUserById(userId)).resolves.toEqual({
			id: userId,
			username: 'demo',
			email: 'demo@example.com',
			role: 'user',
			balance: 10,
		})
	})

	it('returns all users', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ id: userId }] })

		await expect(userModel.findAllUsers()).resolves.toEqual([{ id: userId }])

		expect(db.query).toHaveBeenCalledWith('SELECT id, username, email, role, balance FROM users')
	})

	it('updates users and hashes passwords when present', async () => {
		hashPassword.mockResolvedValueOnce('hashed-password')
		db.query.mockResolvedValueOnce({ rowCount: 1 })

		await expect(
			userModel.updateUser(userId, {
				username: 'new-name',
				password: 'secret123',
			}),
		).resolves.toBe(true)

		expect(hashPassword).toHaveBeenCalledWith('secret123')
		expect(db.query).toHaveBeenCalledWith(
			'UPDATE users SET "username" = $1, "password" = $2 WHERE id = $3',
			['new-name', 'hashed-password', userId],
		)
	})

	it('delegates password verification to argon2', async () => {
		comparePassword.mockResolvedValueOnce(true)

		await expect(userModel.verifyPassword('hashed', 'plain')).resolves.toBe(true)

		expect(comparePassword).toHaveBeenCalledWith('hashed', 'plain')
	})

	it('deletes users by id', async () => {
		db.query.mockResolvedValueOnce({ rowCount: 1 })

		await expect(userModel.deleteUser(userId)).resolves.toBe(true)

		expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', [userId])
	})

	it('reads the user balance', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ balance: 125 }] })

		await expect(userModel.getUserBalance(userId)).resolves.toBe(125)

		expect(db.query).toHaveBeenCalledWith('SELECT balance FROM users WHERE id = $1', [userId])
	})

	it('updates the user balance and records the transaction', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ balance: 150 }] })

		await expect(userModel.updateUserBalance(userId, 50, { type: 'DEPOSIT' })).resolves.toBe(150)

		expect(db.query).toHaveBeenCalledWith(
			`WITH upd AS (
			UPDATE users SET balance = balance + $1
			WHERE id = $2 AND (balance + $1) >= 0
			RETURNING balance
		), ins AS (
			INSERT INTO transactions (user_id, amount, type)
			SELECT $2, abs($1), $3::transaction_type
			WHERE EXISTS (SELECT 1 FROM upd)
			RETURNING id
		)
		SELECT balance FROM upd;
		`,
			[50, userId, 'DEPOSIT'],
		)
	})

	it('counts transactions by user with the existing filters', async () => {
		db.query.mockResolvedValueOnce({ rows: [{ count: 4 }] })

		await expect(userModel.countTransactionsByUser(userId, { type: 'BET' })).resolves.toBe(4)

		expect(db.query).toHaveBeenCalledWith(
			'SELECT COUNT(*)::int AS count FROM transactions WHERE user_id = $1 AND type = $2',
			[userId, 'BET'],
		)
	})
})
