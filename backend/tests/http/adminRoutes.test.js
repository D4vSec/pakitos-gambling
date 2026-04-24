import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getDiscoveredRoutes } from '../helpers/routeDiscovery.js'

vi.mock('#middlewares/authMiddleware', () => ({
	default: (req, res, next) => {
		req.user = {
			id: 1,
			role: req.headers['x-test-role'] ?? 'user',
		}
		next()
	},
}))

vi.mock('#models/userModel', () => ({
	default: {
		findAllUsers: vi.fn(),
		findUserById: vi.fn(),
		updateUser: vi.fn(),
		deleteUser: vi.fn(),
		findTransactionsByUser: vi.fn(),
	},
}))

vi.mock('#models/betsModel', () => ({
	default: {
		deleteBet: vi.fn(),
		updateBet: vi.fn(),
	},
}))

vi.mock('#services/audit', () => ({
	default: {
		getAuditLogs: vi.fn(),
	},
}))

const { default: app } = await import('../../src/app.js')
const { default: User } = await import('#models/userModel')
const { default: Bets } = await import('#models/betsModel')
const { default: AuditService } = await import('#services/audit')

const adminRoutes = getDiscoveredRoutes().filter((route) => route.isAdmin)

const getExpectedStatus = ({ method, path }) => {
	if (method === 'delete' && path === '/v1/user/1') return 204

	return 200
}

describe('admin routes', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		User.findAllUsers.mockResolvedValue([{ id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', balance: 100 }])
		User.findUserById.mockResolvedValue({
			id: 1,
			username: 'demo',
			email: 'demo@example.com',
			role: 'user',
			balance: 50,
		})
		User.updateUser.mockResolvedValue(true)
		User.deleteUser.mockResolvedValue(true)
		User.findTransactionsByUser.mockResolvedValue([])

		Bets.deleteBet.mockResolvedValue(undefined)
		Bets.updateBet.mockResolvedValue(undefined)

		AuditService.getAuditLogs.mockResolvedValue([])
	})

	it.each(
		adminRoutes.map((route, index) => ({
			...route,
			ipAddress: `198.51.100.${index + 1}`,
		})),
	)('$method $path rejects non-admin users', async ({ method, path, ipAddress }) => {
		const response = await request(app)[method](path).set('x-test-role', 'user').set('x-forwarded-for', ipAddress).send({})

		expect(response.status).toBe(403)
		expect(response.body).toEqual({ code: 'NO_PERMISSION' })
	})

	it.each(
		adminRoutes.map((route, index) => ({
			...route,
			ipAddress: `203.0.113.${index + 1}`,
			expectedStatus: getExpectedStatus(route),
		})),
	)('$method $path allows admin users', async ({ method, path, ipAddress, expectedStatus }) => {
		const response = await request(app)[method](path).set('x-test-role', 'admin').set('x-forwarded-for', ipAddress).send({})

		expect(response.status).toBe(expectedStatus)
	})
})
