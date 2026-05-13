import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/user.model', () => ({
	default: {
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

import { createTransaction, getAllUsers, getTransactionsByUserId } from '../../../src/controllers/user.controller.js'
import User from '#models/user.model'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
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
