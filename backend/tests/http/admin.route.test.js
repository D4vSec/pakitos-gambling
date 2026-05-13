import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getDiscoveredRoutes } from '../helpers/routeDiscovery.js'

const ADMIN_ID = '11111111-1111-1111-1111-111111111111'
const TARGET_USER_ID = '22222222-2222-2222-2222-222222222222'
const normalizeAdminPath = (path) => path.replace('/v1/user/1/transactions', `/v1/user/${TARGET_USER_ID}/transactions`).replace('/v1/user/1', `/v1/user/${TARGET_USER_ID}`)

vi.mock('#middlewares/auth.middleware', () => ({
	default: (req, res, next) => {
		req.user = {
			id: '11111111-1111-1111-1111-111111111111',
			role: req.headers['x-test-role'] ?? 'user',
		}
		next()
	},
}))

vi.mock('#models/user.model', () => ({
	default: {
		findAllUsers: vi.fn(),
		findUserById: vi.fn(),
		updateUser: vi.fn(),
		deleteUser: vi.fn(),
		findTransactionsByUser: vi.fn(),
		countTransactionsByUser: vi.fn(),
		countUsers: vi.fn(),
		findUsers: vi.fn(),
	},
}))

vi.mock('#models/bets.model', () => ({
	default: {
		deleteBet: vi.fn(),
		updateBet: vi.fn(),
	},
}))

vi.mock('#services/audit.service', () => ({
	default: {
		createAudit: vi.fn(),
		getAuditLogs: vi.fn(),
		getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
		getUserAgentRaw: vi.fn().mockReturnValue(null),
		countAuditLogs: vi.fn(),
	},
}))

const { default: app } = await import('../../src/app.js')
const { default: User } = await import('#models/user.model')
const { default: Bets } = await import('#models/bets.model')
const { default: AuditService } = await import('#services/audit.service')

const adminRoutes = getDiscoveredRoutes().filter((route) => route.isAdmin)

const getExpectedStatus = ({ method, path }) => {
	if (method === 'delete' && normalizeAdminPath(path) === `/v1/user/${TARGET_USER_ID}`) return 204

	return 200
}

describe('admin routes', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		User.findAllUsers.mockResolvedValue([{ id: ADMIN_ID, username: 'admin', email: 'admin@example.com', role: 'admin', balance: 100 }])
		User.findUserById.mockResolvedValue({
			id: TARGET_USER_ID,
			username: 'demo',
			email: 'demo@example.com',
			role: 'user',
			balance: 50,
		})
		User.updateUser.mockResolvedValue(true)
		User.deleteUser.mockResolvedValue(true)
		User.findTransactionsByUser.mockResolvedValue([])
		User.countTransactionsByUser.mockResolvedValue(0)
		User.countUsers.mockResolvedValue(1)
		User.findUsers.mockResolvedValue([{ id: ADMIN_ID, username: 'admin', email: 'admin@example.com', role: 'admin', balance: 100 }])

		Bets.deleteBet.mockResolvedValue(undefined)
		Bets.updateBet.mockResolvedValue(undefined)

		AuditService.countAuditLogs.mockResolvedValue(0)
		AuditService.getAuditLogs.mockResolvedValue([])
	})

	it.each(
		adminRoutes.map((route, index) => ({
			...route,
			ipAddress: `198.51.100.${index + 1}`,
		})),
	)('$method $path rejects non-admin users', async ({ method, path, ipAddress }) => {
		const response = await request(app)[method](normalizeAdminPath(path)).set('x-test-role', 'user').set('x-forwarded-for', ipAddress).send({})

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
		const response = await request(app)[method](normalizeAdminPath(path)).set('x-test-role', 'admin').set('x-forwarded-for', ipAddress).send({})

		expect(response.status).toBe(expectedStatus)
	})
})
