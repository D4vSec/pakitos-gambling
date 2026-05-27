import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('jsonwebtoken', () => ({
	default: {
		sign: vi.fn(),
		verify: vi.fn(),
		decode: vi.fn(),
	},
}))

vi.mock('#models/user.model', () => ({
	default: {
		findUserById: vi.fn(),
	},
}))

vi.mock('#models/session.model', () => ({
	default: {
		getActiveSessionsByUserId: vi.fn(),
		verifyTokenMatch: vi.fn(),
		revokeSession: vi.fn(),
	},
}))

import jwt from 'jsonwebtoken'

import authMiddleware from '../../../src/middlewares/auth.middleware.js'
import Session from '#models/session.model'
import User from '#models/user.model'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
	setHeader: vi.fn(),
})

const tokenExpiredError = () => Object.assign(new Error('jwt expired'), { name: 'TokenExpiredError' })

describe('auth middleware', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('rejects requests without bearer token', async () => {
		const req = { headers: {} }
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_NO_TOKEN_PROVIDED' })
		expect(next).not.toHaveBeenCalled()
	})

	it('accepts a valid access token', async () => {
		jwt.verify.mockReturnValueOnce({ id: 'user-1', role: 'user' })
		const req = {
			headers: {
				authorization: 'Bearer access-token',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(User.findUserById).not.toHaveBeenCalled()
		expect(req.user).toEqual({ id: 'user-1', role: 'user' })
		expect(next).toHaveBeenCalled()
	})

	it('returns invalid token for unknown users', async () => {
		jwt.verify.mockReturnValueOnce({ id: 'user-1' })
		User.findUserById.mockResolvedValueOnce(null)
		const req = {
			headers: {
				authorization: 'Bearer access-token',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_INVALID_TOKEN' })
		expect(next).not.toHaveBeenCalled()
	})

	it('falls back to the database when legacy access tokens have no role', async () => {
		jwt.verify.mockReturnValueOnce({ id: 'user-1' })
		User.findUserById.mockResolvedValueOnce({ id: 'user-1', role: 'admin' })
		const req = {
			headers: {
				authorization: 'Bearer access-token',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(User.findUserById).toHaveBeenCalledWith('user-1')
		expect(req.user).toEqual({ id: 'user-1', role: 'admin' })
		expect(next).toHaveBeenCalled()
	})

	it('returns invalid token when verification fails', async () => {
		jwt.verify.mockImplementationOnce(() => {
			throw new Error('invalid token')
		})
		const req = {
			headers: {
				authorization: 'Bearer access-token',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_INVALID_TOKEN' })
		expect(next).not.toHaveBeenCalled()
	})

	it('returns no token when an expired access token has no refresh token', async () => {
		jwt.verify.mockImplementationOnce(() => {
			throw tokenExpiredError()
		})
		const req = {
			headers: {
				authorization: 'Bearer access-token',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_NO_TOKEN_PROVIDED' })
		expect(next).not.toHaveBeenCalled()
	})

	it('returns invalid session when refresh validation fails', async () => {
		jwt.verify
			.mockImplementationOnce(() => {
				throw tokenExpiredError()
			})
			.mockReturnValueOnce({ id: 'user-1' })
		Session.getActiveSessionsByUserId.mockResolvedValueOnce([])
		Session.verifyTokenMatch.mockResolvedValueOnce(null)
		const req = {
			headers: {
				authorization: 'Bearer expired-access',
				'x-refresh-token': 'refresh-token',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_INVALID_SESSION' })
		expect(next).not.toHaveBeenCalled()
	})

	it('reissues only the access token when the refresh token is valid', async () => {
		jwt.verify
			.mockImplementationOnce(() => {
				throw tokenExpiredError()
			})
			.mockReturnValueOnce({ id: 'user-1' })
		Session.getActiveSessionsByUserId.mockResolvedValueOnce([{ id: 'session-1' }])
		Session.verifyTokenMatch.mockResolvedValueOnce({
			id: 'session-1',
			expires_at: '2999-12-31T23:59:59.000Z',
		})
		User.findUserById.mockResolvedValueOnce({ id: 'user-1', role: 'admin' })
		jwt.sign.mockReturnValueOnce('new-access')
		const req = {
			headers: {
				authorization: 'Bearer expired-access',
				'x-refresh-token': 'refresh-token',
			},
			useragent: {
				browser: 'Chrome',
				version: '120.0',
				os: 'Windows',
				platform: 'Win32',
				isMobile: false,
				isTablet: false,
				isDesktop: true,
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(Session.revokeSession).not.toHaveBeenCalled()
		expect(res.setHeader).toHaveBeenCalledWith('x-access-token', 'new-access')
		expect(res.setHeader).toHaveBeenCalledWith('x-refresh-token', 'refresh-token')
		expect(req.user).toEqual({ id: 'user-1', role: 'admin' })
		expect(next).toHaveBeenCalled()
	})

	it('returns session expired when refresh verification fails', async () => {
		jwt.verify.mockImplementationOnce(() => {
			throw tokenExpiredError()
		})
		jwt.verify.mockImplementationOnce(() => {
			throw new Error('invalid refresh')
		})
		const req = {
			headers: {
				authorization: 'Bearer expired-access',
				'x-refresh-token': 'refresh-token',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_SESSION_EXPIRED' })
		expect(next).not.toHaveBeenCalled()
	})

	it('revokes the session when the refresh token itself has expired', async () => {
		jwt.verify
			.mockImplementationOnce(() => {
				throw tokenExpiredError()
			})
			.mockImplementationOnce(() => {
				throw tokenExpiredError()
			})
		jwt.decode.mockReturnValueOnce({ id: 'user-1' })
		Session.getActiveSessionsByUserId.mockResolvedValueOnce([{ id: 'session-1' }])
		Session.verifyTokenMatch.mockResolvedValueOnce({ id: 'session-1' })
		const req = {
			headers: {
				authorization: 'Bearer expired-access',
				'x-refresh-token': 'refresh-token',
			},
		}
		const res = createResponse()
		const next = vi.fn()

		await authMiddleware(req, res, next)

		expect(Session.revokeSession).toHaveBeenCalledWith('session-1')
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_SESSION_EXPIRED' })
		expect(next).not.toHaveBeenCalled()
	})
})
