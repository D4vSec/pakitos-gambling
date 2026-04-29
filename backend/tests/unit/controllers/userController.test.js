import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/userModel', () => ({
	default: {
		findUserById: vi.fn(),
		updateUserBalance: vi.fn(),
	},
}))

import { createTransaction } from '../../../src/controllers/userController.js'
import User from '#models/userModel'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

describe('userController createTransaction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		User.findUserById.mockResolvedValue({ id: 'user-1' })
		User.updateUserBalance.mockResolvedValue(125)
	})

	it('accepts new credit transaction types', async () => {
		const req = {
			user: { id: 'user-1' },
			body: {
				type: 'BONUS',
				amount: 25,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(User.updateUserBalance).toHaveBeenCalledWith('user-1', 25, {
			type: 'BONUS',
		})
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({ balance: 125 })
	})

	it('accepts new debit transaction types', async () => {
		const req = {
			user: { id: 'user-1' },
			body: {
				type: 'LOSE',
				amount: 15,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(User.updateUserBalance).toHaveBeenCalledWith('user-1', -15, {
			type: 'LOSE',
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

	it('returns insufficient funds for debit transaction types', async () => {
		User.updateUserBalance.mockResolvedValueOnce(null)
		const req = {
			user: { id: 'user-1' },
			body: {
				type: 'BET',
				amount: 300,
			},
		}
		const res = createResponse()

		await createTransaction(req, res)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INSUFFICIENT_FUNDS' })
	})
})
