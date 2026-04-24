import { describe, expect, it, vi } from 'vitest'

import adminMiddleware from '../../../src/middlewares/adminMiddleware.js'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

describe('adminMiddleware', () => {
	it('returns 403 when the user is missing', () => {
		const req = {}
		const res = createResponse()
		const next = vi.fn()

		adminMiddleware(req, res, next)

		expect(res.status).toHaveBeenCalledWith(403)
		expect(res.json).toHaveBeenCalledWith({ code: 'NO_PERMISSION' })
		expect(next).not.toHaveBeenCalled()
	})

	it('returns 403 when the user is not admin', () => {
		const req = {
			user: {
				id: 1,
				role: 'user',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		adminMiddleware(req, res, next)

		expect(res.status).toHaveBeenCalledWith(403)
		expect(res.json).toHaveBeenCalledWith({ code: 'NO_PERMISSION' })
		expect(next).not.toHaveBeenCalled()
	})

	it('calls next for admin users', () => {
		const req = {
			user: {
				id: 1,
				role: 'admin',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		adminMiddleware(req, res, next)

		expect(next).toHaveBeenCalled()
		expect(res.status).not.toHaveBeenCalled()
	})
})
