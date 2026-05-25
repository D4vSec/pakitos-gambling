import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getDiscoveredRoutes } from '../helpers/routeDiscovery.js'

const ADMIN_ID = '11111111-1111-1111-1111-111111111111'
const TARGET_USER_ID = '22222222-2222-2222-2222-222222222222'
const normalizeAdminPath = (path) =>
	path
		.replace('/v1/user/1/transactions', `/v1/user/${TARGET_USER_ID}/transactions`)
		.replace('/v1/user/1', `/v1/user/${TARGET_USER_ID}`)
		.replace('/v1/bets/admin/1/close', `/v1/bets/admin/${TARGET_USER_ID}/close`)
		.replace('/v1/bets/admin/1/settlement-preview', `/v1/bets/admin/${TARGET_USER_ID}/settlement-preview`)
		.replace('/v1/bets/admin/1', `/v1/bets/admin/${TARGET_USER_ID}`)
		.replace('/v1/bets/1', `/v1/bets/${TARGET_USER_ID}`)

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
		getBetById: vi.fn(),
		getBetInfo: vi.fn(),
		getPoolDistribution: vi.fn(),
		updateBet: vi.fn(),
	},
}))

vi.mock('#services/bets.service', () => ({
	default: {
		closeBet: vi.fn(),
		countBets: vi.fn(),
		createBet: vi.fn(),
		deleteBet: vi.fn(),
		getAdminBet: vi.fn(),
		getBets: vi.fn(),
		getSettlementPreview: vi.fn(),
		hasBetActivity: vi.fn(),
		updateBet: vi.fn(),
		updateOddsForBet: vi.fn(),
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
const { default: BetService } = await import('#services/bets.service')
const { default: AuditService } = await import('#services/audit.service')

const adminRoutes = getDiscoveredRoutes().filter((route) => route.isAdmin)

const getExpectedStatus = ({ method, path }) => {
	if (method === 'delete' && normalizeAdminPath(path) === `/v1/user/${TARGET_USER_ID}`) return 204
	if (method === 'post' && path === '/v1/bets/admin') return 201

	return 200
}

const getRequestBody = ({ method, path }) => {
	if (method === 'post' && path === '/v1/bets/admin') {
		return {
			label: 'Champions League Winner',
			ends_at: '2026-06-01T18:00:00.000Z',
			options: [
				{ label: 'Barca', odd: 2.1 },
				{ label: 'Madrid', odd: 1.8 },
			],
		}
	}

	if (method === 'post' && path === '/v1/bets/admin/1/settlement-preview') {
		return {
			winningOptionId: TARGET_USER_ID,
		}
	}

	if (method === 'put' && path === '/v1/bets/1') {
		return {
			label: 'Updated Bet',
			ends_at: '2026-06-01T18:00:00.000Z',
		}
	}

	return {}
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
		Bets.getBetById.mockResolvedValue({ id: TARGET_USER_ID, label: 'Bet', ends_at: '2026-06-01T18:00:00.000Z', status: 'open' })
		Bets.getBetInfo.mockResolvedValue([{ id: TARGET_USER_ID, label: 'Barca', odd: 2.1 }])
		Bets.getPoolDistribution.mockResolvedValue([{ id: TARGET_USER_ID, label: 'Barca', amount: 10, odd: 2.1 }])
		Bets.updateBet.mockResolvedValue(undefined)

		BetService.closeBet.mockResolvedValue({ id: TARGET_USER_ID })
		BetService.countBets.mockResolvedValue(1)
		BetService.createBet.mockResolvedValue({ id: TARGET_USER_ID, options: [{ id: 'opt-1' }, { id: 'opt-2' }] })
		BetService.deleteBet.mockResolvedValue(true)
		BetService.getAdminBet.mockResolvedValue({
			bet: { id: TARGET_USER_ID, label: 'Bet', ends_at: '2026-06-01T18:00:00.000Z', status: 'open' },
			options: [{ id: 'opt-1', label: 'Barca', odd: 2.1 }],
			poolDistribution: [],
			totalPool: 0,
		})
		BetService.getBets.mockResolvedValue([{ id: TARGET_USER_ID, label: 'Bet', status: 'open' }])
		BetService.getSettlementPreview.mockResolvedValue({
			bet: { id: TARGET_USER_ID },
			poolDistribution: [],
			totalPool: 0,
			winningOption: { id: TARGET_USER_ID, label: 'Barca', odd: 2.1 },
			totalWinningAmount: 0,
			totalProjectedPayout: 0,
			winners: [],
		})
		BetService.hasBetActivity.mockResolvedValue(false)
		BetService.updateBet.mockResolvedValue({ id: TARGET_USER_ID })

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
		const response = await request(app)[method](normalizeAdminPath(path))
			.set('x-test-role', 'admin')
			.set('x-forwarded-for', ipAddress)
			.send(getRequestBody({ method, path }))

		expect(response.status).toBe(expectedStatus)
	})
})
