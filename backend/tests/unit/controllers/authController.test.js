import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/userModel', () => ({
	default: {
		createUser: vi.fn(),
		findUserByEmail: vi.fn(),
		verifyPassword: vi.fn(),
	},
}))

vi.mock('#models/sessionModel', () => ({
	default: {
		createSession: vi.fn(),
	},
}))

import { login, register } from '../../../src/controllers/authController.js'
import User from '#models/userModel'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

describe('authController example tests', () => {
	beforeEach(() => {
		vi.clearAllMocks()
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
		expect(res.json).toHaveBeenCalledWith({
			code: 'AUTH_MISSING_FIELDS',
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

	it('login returns 401 when the user does not exist', async () => {
		User.findUserByEmail.mockResolvedValue(null)

		const req = {
			body: {
				email: 'missing@example.com',
				password: '12345678',
			},
		}
		const res = createResponse()

		await login(req, res)

		expect(User.findUserByEmail).toHaveBeenCalledWith('missing@example.com')
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({
			code: 'AUTH_INVALID_CREDENTIALS',
		})
	})
})
