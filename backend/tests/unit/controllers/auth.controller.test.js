import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('jsonwebtoken', () => ({
	default: {
		sign: vi.fn(),
		verify: vi.fn(),
	},
}))

vi.mock('#models/user.model', () => ({
	default: {
		createUser: vi.fn(),
		findUserByEmail: vi.fn(),
		verifyPassword: vi.fn(),
		findUserById: vi.fn(),
	},
}))

vi.mock('#models/session.model', () => ({
	default: {
		createSession: vi.fn(),
		getActiveSessionsByUserId: vi.fn(),
		verifyTokenMatch: vi.fn(),
		revokeSession: vi.fn(),
	},
}))

vi.mock('#services/audit.service', () => ({
	default: {
		createAudit: vi.fn(),
		getClientIp: vi.fn((req) => req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || req?.socket?.remoteAddress || null),
		getUserAgentRaw: vi.fn((req) => {
			if (!req?.useragent) return null

			const { browser, version, os, platform, isMobile, isTablet, isDesktop } = req.useragent
			const raw = { browser, version, os, platform, isMobile, isTablet, isDesktop }

			return { raw, formatted: `${browser} ${version} / ${os}` }
		}),
	},
}))

import jwt from 'jsonwebtoken'

import { generateTokens, login, refresh, register } from '../../../src/controllers/auth.controller.js'
import Session from '#models/session.model'
import User from '#models/user.model'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

describe('auth.controller', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(console, 'error').mockImplementation(() => {})

		jwt.sign
			.mockReturnValueOnce('access-token')
			.mockReturnValueOnce('refresh-token')
	})

	it('generateTokens returns access and refresh tokens', () => {
		const tokens = generateTokens({ id: 7 })

		expect(jwt.sign).toHaveBeenCalledTimes(2)
		expect(tokens).toEqual({
			accessToken: 'access-token',
			refreshToken: 'refresh-token',
		})
	})

	it('register returns 400 when body is missing', async () => {
		const res = createResponse()

		await register({}, res)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_NO_DATA_PROVIDED' })
	})

	it('register returns 400 when required fields are missing', async () => {
		const req = {
			body: {
				email: 'demo@example.com',
			},
		}
		const res = createResponse()

		await register(req, res)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_MISSING_FIELDS' })
	})

	it('register validates username, email and password', async () => {
		const res = createResponse()

		await register(
			{
				body: {
					username: 'ab',
					email: 'demo@example.com',
					password: '12345678',
				},
			},
			res,
		)

		expect(res.status).toHaveBeenLastCalledWith(400)
		expect(res.json).toHaveBeenLastCalledWith({
			code: 'AUTH_INVALID_USERNAME',
			message: 'Invalid username',
		})

		await register(
			{
				body: {
					username: 'demo',
					email: 'not-an-email',
					password: '12345678',
				},
			},
			res,
		)

		expect(res.json).toHaveBeenLastCalledWith({
			code: 'AUTH_INVALID_EMAIL',
			message: 'Invalid email',
		})

		await register(
			{
				body: {
					username: 'demo',
					email: 'demo@example.com',
					password: '123',
				},
			},
			res,
		)

		expect(res.json).toHaveBeenLastCalledWith({
			code: 'AUTH_PASSWORD_TOO_SHORT',
			message: 'Password too short',
		})
	})

	it('register creates the user with normalized email', async () => {
		const req = {
			body: {
				username: 'demo',
				email: ' Demo@Example.com ',
				password: '12345678',
			},
		}
		const res = createResponse()

		await register(req, res)

		expect(User.createUser).toHaveBeenCalledWith({
			username: 'demo',
			email: 'demo@example.com',
			password: '12345678',
		})
		expect(res.status).toHaveBeenCalledWith(201)
		expect(res.json).toHaveBeenCalledWith({
			code: 'AUTH_USER_REGISTERED',
		})
	})

	it('register returns 409 for duplicate emails', async () => {
		User.createUser.mockRejectedValueOnce({ code: '23505' })
		const res = createResponse()

		await register(
			{
				body: {
					username: 'demo',
					email: 'demo@example.com',
					password: '12345678',
				},
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(409)
		expect(res.json).toHaveBeenCalledWith({
			code: 'AUTH_EMAIL_ALREADY_REGISTERED',
		})
	})

	it('register returns 500 on unexpected errors', async () => {
		User.createUser.mockRejectedValueOnce(new Error('db down'))
		const res = createResponse()

		await register(
			{
				body: {
					username: 'demo',
					email: 'demo@example.com',
					password: '12345678',
				},
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ code: 'SERVER_ERROR' })
	})

	it('login returns 400 when body is missing', async () => {
		const res = createResponse()

		await login({}, res)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_NO_DATA_PROVIDED' })
	})

	it('login returns 400 when required fields are missing', async () => {
		const res = createResponse()

		await login(
			{
				body: {
					email: 'demo@example.com',
				},
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_MISSING_FIELDS' })
	})

	it('login returns 401 when the user does not exist', async () => {
		User.findUserByEmail.mockResolvedValueOnce(null)
		const res = createResponse()

		await login(
			{
				body: {
					email: 'missing@example.com',
					password: '12345678',
				},
			},
			res,
		)

		expect(User.findUserByEmail).toHaveBeenCalledWith('missing@example.com')
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({
			code: 'AUTH_INVALID_CREDENTIALS',
		})
	})

	it('login returns 401 when the password is invalid', async () => {
		User.findUserByEmail.mockResolvedValueOnce({ id: 7, password: 'hashed' })
		User.verifyPassword.mockResolvedValueOnce(false)
		const res = createResponse()

		await login(
			{
				body: {
					email: 'demo@example.com',
					password: 'wrong-password',
				},
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({
			code: 'AUTH_INVALID_CREDENTIALS',
		})
	})

	it('login creates a session and returns tokens', async () => {
		User.findUserByEmail.mockResolvedValueOnce({ id: 7, password: 'hashed' })
		User.verifyPassword.mockResolvedValueOnce(true)
		const res = createResponse()

		await login(
			{
				body: {
					email: 'demo@example.com',
					password: '12345678',
				},
			},
			res,
		)

		expect(Session.createSession).toHaveBeenCalledWith(7, 'refresh-token', null)
		expect(res.json).toHaveBeenCalledWith({
			accessToken: 'access-token',
			refreshToken: 'refresh-token',
		})
	})

	it('login saves device info when useragent provided', async () => {
		User.findUserByEmail.mockResolvedValueOnce({ id: 7, password: 'hashed' })
		User.verifyPassword.mockResolvedValueOnce(true)
		const res = createResponse()

		const req = {
			body: {
				email: 'demo@example.com',
				password: '12345678',
			},
			useragent: {
				browser: 'Chrome',
				version: '90.0',
				os: 'Windows',
				platform: 'Win32',
				isMobile: false,
				isTablet: false,
				isDesktop: true,
			},
		}

		await login(req, res)

		const expectedDevice = JSON.stringify({
			browser: 'Chrome',
			version: '90.0',
			os: 'Windows',
			platform: 'Win32',
			isMobile: false,
			isTablet: false,
			isDesktop: true,
		})

		expect(Session.createSession).toHaveBeenCalledWith(7, 'refresh-token', expectedDevice)
		expect(res.json).toHaveBeenCalledWith({
			accessToken: 'access-token',
			refreshToken: 'refresh-token',
		})
	})

	it('login returns 500 on unexpected errors', async () => {
		User.findUserByEmail.mockRejectedValueOnce(new Error('db down'))
		const res = createResponse()

		await login(
			{
				body: {
					email: 'demo@example.com',
					password: '12345678',
				},
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ code: 'SERVER_ERROR' })
	})

	it('refresh returns 401 when the token is missing', async () => {
		const res = createResponse()

		await refresh({ body: {} }, res)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_NO_TOKEN_PROVIDED' })
	})

	it('refresh returns 401 when the session is invalid', async () => {
		jwt.verify.mockReturnValueOnce({ id: 7 })
		Session.getActiveSessionsByUserId.mockResolvedValueOnce([])
		Session.verifyTokenMatch.mockResolvedValueOnce(null)
		const res = createResponse()

		await refresh({ body: { refreshToken: 'refresh-token' } }, res)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_INVALID_SESSION' })
	})

	it('refresh rotates the session and returns new tokens', async () => {
		jwt.verify.mockReturnValueOnce({ id: 7 })
		Session.getActiveSessionsByUserId.mockResolvedValueOnce([{ id: 3 }])
		Session.verifyTokenMatch.mockResolvedValueOnce({
			id: 3,
			expires_at: '2999-12-31T23:59:59.000Z',
		})
		User.findUserById.mockResolvedValueOnce({ id: 7 })
		const res = createResponse()

		await refresh({ body: { refreshToken: 'refresh-token' } }, res)

		expect(Session.revokeSession).toHaveBeenCalledWith(3)
		expect(Session.createSession).toHaveBeenCalledWith(7, 'refresh-token', null)
		expect(res.json).toHaveBeenCalledWith({
			accessToken: 'access-token',
			refreshToken: 'refresh-token',
		})
	})

	it('refresh saves device info when useragent provided', async () => {
		jwt.verify.mockReturnValueOnce({ id: 7 })
		Session.getActiveSessionsByUserId.mockResolvedValueOnce([{ id: 3 }])
		Session.verifyTokenMatch.mockResolvedValueOnce({
			id: 3,
			expires_at: '2999-12-31T23:59:59.000Z',
		})
		User.findUserById.mockResolvedValueOnce({ id: 7 })
		const res = createResponse()

		const req = {
			body: { refreshToken: 'refresh-token' },
			useragent: {
				browser: 'Firefox',
				version: '100.0',
				os: 'Linux',
				platform: 'x86_64',
				isMobile: false,
				isTablet: false,
				isDesktop: true,
			},
		}

		await refresh(req, res)

		expect(Session.revokeSession).toHaveBeenCalledWith(3)
		const expectedDevice = JSON.stringify({
			browser: 'Firefox',
			version: '100.0',
			os: 'Linux',
			platform: 'x86_64',
			isMobile: false,
			isTablet: false,
			isDesktop: true,
		})
		expect(Session.createSession).toHaveBeenCalledWith(7, 'refresh-token', expectedDevice)
		expect(res.json).toHaveBeenCalledWith({
			accessToken: 'access-token',
			refreshToken: 'refresh-token',
		})
	})

	it('refresh returns 401 when token verification fails', async () => {
		jwt.verify.mockImplementationOnce(() => {
			throw new Error('invalid token')
		})
		const res = createResponse()

		await refresh({ body: { refreshToken: 'refresh-token' } }, res)

		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({
			code: 'AUTH_INVALID_REFRESH_TOKEN',
		})
	})
})
