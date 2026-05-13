import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/user.model', () => ({
	default: {
		deleteUser: vi.fn(),
		updateUser: vi.fn(),
		getUserBalance: vi.fn(),
		countTransactionsByUser: vi.fn(),
		countUsers: vi.fn(),
		findUserById: vi.fn(),
		findTransactionsByUser: vi.fn(),
		findUsers: vi.fn(),
		updateUserBalance: vi.fn(),
	},
}))

vi.mock('#services/audit.service', () => ({
	default: {
		createAudit: vi.fn(),
		getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
		getUserAgentRaw: vi.fn().mockReturnValue(null),
	},
}))

vi.mock('#utils/logger.utils', () => ({
	default: {
		error: vi.fn(),
	},
}))

import {
	createTransaction,
	deleteSelf,
	deleteUserById,
	getAllUsers,
	getProfile,
	getSelfBalance,
	getTransactions,
	getTransactionsByUserId,
	getUserById,
	updateSelf,
	updateUserById,
} from '../../../src/controllers/user.controller.js'
import Audit from '#services/audit.service'
import User from '#models/user.model'
import logger from '#utils/logger.utils'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
	send: vi.fn(),
})

describe('user.controller createTransaction', () => {
	const userId = '11111111-1111-1111-1111-111111111111'

	beforeEach(() => {
		vi.clearAllMocks()
		User.findUserById.mockResolvedValue({ id: userId })
		User.updateUserBalance.mockResolvedValue(125)
	})

	it('accepts DEPOSIT transactions', async () => {
		const req = {
			user: { id: userId },
			body: {
				type: 'DEPOSIT',
				amount: 25,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(User.updateUserBalance).toHaveBeenCalledWith(userId, 25, {
			type: 'DEPOSIT',
		})
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({ balance: 125 })
	})

	it('accepts WITHDRAWAL transactions', async () => {
		const req = {
			user: { id: userId },
			body: {
				type: 'WITHDRAWAL',
				amount: 15,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(User.updateUserBalance).toHaveBeenCalledWith(userId, -15, {
			type: 'WITHDRAWAL',
		})
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({ balance: 125 })
	})

	it('returns invalid data for unsupported transaction types', async () => {
		const req = {
			user: { id: userId },
			body: {
				type: 'cashout',
				amount: 15,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(User.updateUserBalance).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INVALID_TRANSACTION_DATA' })
	})

	it('returns insufficient funds for withdrawal', async () => {
		User.updateUserBalance.mockResolvedValueOnce(null)
		const req = {
			user: { id: userId },
			body: {
				type: 'WITHDRAWAL',
				amount: 300,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INSUFFICIENT_FUNDS' })
	})
})

describe('user.controller profile and admin actions', () => {
	const userId = '11111111-1111-1111-1111-111111111111'
	const targetUserId = '22222222-2222-2222-2222-222222222222'

	beforeEach(() => {
		vi.clearAllMocks()
		User.findUserById.mockResolvedValue({ id: userId })
		User.deleteUser.mockResolvedValue(true)
		User.updateUser.mockResolvedValue(true)
		User.getUserBalance.mockResolvedValue(125)
		Audit.getUserAgentRaw.mockReturnValue(null)
	})

	it('returns the current profile', async () => {
		User.findUserById.mockResolvedValueOnce({
			id: userId,
			username: 'demo',
			email: 'demo@example.com',
			role: 'user',
			balance: 125,
		})
		const res = createResponse()

		await getProfile({ user: { id: userId } }, res)

		expect(res.json).toHaveBeenCalledWith({
			id: userId,
			username: 'demo',
			email: 'demo@example.com',
			role: 'user',
			balance: 125,
		})
	})

	it('returns 404 when the profile does not exist', async () => {
		User.findUserById.mockResolvedValueOnce(null)
		const res = createResponse()

		await getProfile({ user: { id: userId } }, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({ code: 'USER_NOT_FOUND' })
	})

	it('deletes the current user', async () => {
		const res = createResponse()

		await deleteSelf({ user: { id: userId } }, res)

		expect(User.deleteUser).toHaveBeenCalledWith(userId)
		expect(res.status).toHaveBeenCalledWith(204)
		expect(res.send).toHaveBeenCalled()
	})

	it('returns 404 when deleting the current user fails', async () => {
		User.deleteUser.mockResolvedValueOnce(false)
		const res = createResponse()

		await deleteSelf({ user: { id: userId } }, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({ code: 'USER_NOT_FOUND' })
	})

	it('updates the current user', async () => {
		const res = createResponse()

		await updateSelf(
			{
				user: { id: userId },
				body: {
					username: 'new-name',
					email: 'new@example.com',
				},
			},
			res,
		)

		expect(User.updateUser).toHaveBeenCalledWith(userId, {
			username: 'new-name',
			email: 'new@example.com',
		})
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({ code: 'SUCCESS' })
	})

	it('returns validation errors when updating the current user with invalid data', async () => {
		const res = createResponse()

		await updateSelf(
			{
				user: { id: userId },
				body: {
					username: 'ab',
				},
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json.mock.calls[0][0]).toHaveProperty('errors')
	})

	it('gets a user by id', async () => {
		User.findUserById.mockResolvedValueOnce({
			id: targetUserId,
			username: 'target',
			email: 'target@example.com',
			role: 'admin',
			balance: 50,
		})
		const res = createResponse()

		await getUserById({ params: { id: targetUserId } }, res)

		expect(res.json).toHaveBeenCalledWith({
			id: targetUserId,
			username: 'target',
			email: 'target@example.com',
			role: 'admin',
			balance: 50,
		})
	})

	it('returns 404 for invalid user ids', async () => {
		const res = createResponse()

		await getUserById({ params: { id: 'not-a-uuid' } }, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({ code: 'USER_NOT_FOUND' })
	})

	it('updates a user by id and records an audit log', async () => {
		const res = createResponse()

		await updateUserById(
			{
				user: { id: userId },
				params: { id: targetUserId },
				body: {
					role: 'admin',
				},
			},
			res,
		)

		expect(User.updateUser).toHaveBeenCalledWith(targetUserId, { role: 'admin' })
		expect(Audit.createAudit).toHaveBeenCalledWith(
			expect.objectContaining({
				user_id: userId,
				action: 'ADMIN_ACTION',
				details: expect.objectContaining({
					type: 'USER_UPDATED',
					targetUserId,
					changes: ['role'],
				}),
			}),
		)
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({ code: 'SUCCESS' })
	})

	it('returns 404 when updating a user with an invalid id', async () => {
		const res = createResponse()

		await updateUserById({ params: { id: 'bad-id' }, body: { role: 'admin' } }, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({ code: 'USER_NOT_FOUND' })
	})

	it('deletes a user by id and records an audit log', async () => {
		const res = createResponse()

		await deleteUserById(
			{
				user: { id: userId },
				params: { id: targetUserId },
			},
			res,
		)

		expect(User.deleteUser).toHaveBeenCalledWith(targetUserId)
		expect(Audit.createAudit).toHaveBeenCalledWith(
			expect.objectContaining({
				user_id: userId,
				action: 'ADMIN_ACTION',
				details: expect.objectContaining({
					type: 'USER_DELETED',
					targetUserId,
				}),
			}),
		)
		expect(res.status).toHaveBeenCalledWith(204)
		expect(res.send).toHaveBeenCalled()
	})

	it('returns 404 when deleting a user with an invalid id', async () => {
		const res = createResponse()

		await deleteUserById({ params: { id: 'bad-id' } }, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({ code: 'USER_NOT_FOUND' })
	})

	it('returns the current balance', async () => {
		const res = createResponse()

		await getSelfBalance({ user: { id: userId } }, res)

		expect(User.getUserBalance).toHaveBeenCalledWith(userId)
		expect(res.json).toHaveBeenCalledWith({ balance: 125 })
	})

	it('returns 404 when the current balance cannot be found', async () => {
		User.getUserBalance.mockResolvedValueOnce(null)
		const res = createResponse()

		await getSelfBalance({ user: { id: userId } }, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({ code: 'USER_NOT_FOUND' })
	})
})

describe('user.controller lists', () => {
	const userId = '11111111-1111-1111-1111-111111111111'

	beforeEach(() => {
		vi.clearAllMocks()
		User.findUserById.mockResolvedValue({ id: userId })
		User.countUsers.mockResolvedValue(3)
		User.findUsers.mockResolvedValue([
			{ id: 'u1', username: 'alpha' },
			{ id: 'u2', username: 'beta' },
		])
		User.countTransactionsByUser.mockResolvedValue(3)
		User.findTransactionsByUser.mockResolvedValue([
			{ id: 't1', amount: 25, type: 'BET' },
			{ id: 't2', amount: 50, type: 'WIN' },
		])
	})

	it('returns paginated users', async () => {
		const res = createResponse()

		await getAllUsers({ query: { page: '1', limit: '2' } }, res)

		expect(User.countUsers).toHaveBeenCalledWith({})
		expect(User.findUsers).toHaveBeenCalledWith(1, 2, {})
		expect(res.json).toHaveBeenCalledWith({
			page: 1,
			limit: 2,
			totalPages: 2,
			users: [
				{ id: 'u1', username: 'alpha' },
				{ id: 'u2', username: 'beta' },
			],
		})
	})

	it('returns 500 when listing users fails', async () => {
		User.countUsers.mockRejectedValueOnce(new Error('db down'))
		const res = createResponse()

		await getAllUsers({ query: {} }, res)

		expect(logger.error).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ code: 'SERVER_ERROR' })
	})

	it('returns paginated transactions for the current user', async () => {
		const res = createResponse()

		await getTransactions({ user: { id: userId }, query: { page: '1', limit: '2' } }, res)

		expect(User.countTransactionsByUser).toHaveBeenCalledWith(userId, {})
		expect(User.findTransactionsByUser).toHaveBeenCalledWith(userId, 1, 2, {})
		expect(res.json).toHaveBeenCalledWith({
			page: 1,
			limit: 2,
			totalPages: 2,
			transactions: [
				{ id: 't1', amount: 25, type: 'BET' },
				{ id: 't2', amount: 50, type: 'WIN' },
			],
		})
	})

	it('returns 400 when the requested transaction page exceeds the total pages', async () => {
		User.countTransactionsByUser.mockResolvedValueOnce(0)
		const res = createResponse()

		await getTransactions({ user: { id: userId }, query: { page: '2', limit: '20' } }, res)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'PAGE_EXCEDED' })
	})

	it('returns 500 when listing transactions fails', async () => {
		User.countTransactionsByUser.mockRejectedValueOnce(new Error('db down'))
		const res = createResponse()

		await getTransactions({ user: { id: userId }, query: {} }, res)

		expect(logger.error).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ code: 'SERVER_ERROR' })
	})

	it('returns paginated transactions for another user', async () => {
		User.findUserById.mockResolvedValueOnce({ id: userId })
		const res = createResponse()

		await getTransactionsByUserId({ params: { id: userId }, query: { page: '1', limit: '2' } }, res)

		expect(User.findUserById).toHaveBeenCalledWith(userId)
		expect(User.countTransactionsByUser).toHaveBeenCalledWith(userId, {})
		expect(User.findTransactionsByUser).toHaveBeenCalledWith(userId, 1, 2, {})
		expect(res.json).toHaveBeenCalledWith({
			page: 1,
			limit: 2,
			totalPages: 2,
			transactions: [
				{ id: 't1', amount: 25, type: 'BET' },
				{ id: 't2', amount: 50, type: 'WIN' },
			],
		})
	})

	it('returns 404 when the requested user does not exist', async () => {
		User.findUserById.mockResolvedValueOnce(null)
		const res = createResponse()

		await getTransactionsByUserId({ params: { id: userId }, query: {} }, res)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({ code: 'USER_NOT_FOUND' })
	})

	it('returns 500 when listing transactions by user fails', async () => {
		User.countTransactionsByUser.mockRejectedValueOnce(new Error('db down'))
		const res = createResponse()

		await getTransactionsByUserId({ params: { id: userId }, query: {} }, res)

		expect(logger.error).toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ code: 'SERVER_ERROR' })
	})
})

describe('user.controller query validation', () => {
	const userId = '11111111-1111-1111-1111-111111111111'

	beforeEach(() => {
		vi.clearAllMocks()
		User.findUserById.mockResolvedValue({ id: userId })
		User.countUsers.mockResolvedValue(0)
		User.findUsers.mockResolvedValue([])
		User.countTransactionsByUser.mockResolvedValue(0)
		User.findTransactionsByUser.mockResolvedValue([])
	})

	it('rejects invalid user sort columns', async () => {
		const res = createResponse()

		await getAllUsers({ query: { sortBy: 'password' } }, res)

		expect(User.countUsers).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json.mock.calls[0][0].code).toBeUndefined()
	})

	it('rejects invalid transaction filter enum values', async () => {
		const res = createResponse()

		await getTransactionsByUserId({
			params: { id: userId },
			query: { type: '["BET","HACK"]' },
		}, res)

		expect(User.countTransactionsByUser).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json.mock.calls[0][0].errors).toBeDefined()
	})
})
