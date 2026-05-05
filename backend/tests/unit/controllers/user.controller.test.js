import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/user.model', () => ({
	default: {
		findUserById: vi.fn(),
		updateUserBalance: vi.fn(),
	},
}))

import { createTransaction } from '../../../src/controllers/user.controller.js'
import User from '#models/user.model'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

describe('user.controller createTransaction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		User.findUserById.mockResolvedValue({ id: 'user-1' })
		User.updateUserBalance.mockResolvedValue(125)
	})

	it('accepts DEPOSIT transactions', async () => {
		const req = {
			user: { id: 'user-1' },
			body: {
				type: 'DEPOSIT',
				amount: 25,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(User.updateUserBalance).toHaveBeenCalledWith('user-1', 25, {
			type: 'DEPOSIT',
		})
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({ balance: 125 })
	})

	it('accepts WITHDRAWAL transactions', async () => {
		const req = {
			user: { id: 'user-1' },
			body: {
				type: 'WITHDRAWAL',
				amount: 15,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(User.updateUserBalance).toHaveBeenCalledWith('user-1', -15, {
			type: 'WITHDRAWAL',
		})
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({ balance: 125 })
	})

	it('returns invalid data for unsupported transaction types', async () => {
		const req = {
			user: { id: 'user-1' },
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
			user: { id: 'user-1' },
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
