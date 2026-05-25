import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/bets.model', () => ({
	default: {
		deleteBet: vi.fn(),
		getBetById: vi.fn(),
		getBetInfo: vi.fn(),
		getOptionsByOptionId: vi.fn(),
		placeBet: vi.fn(),
		updateBet: vi.fn(),
	},
}))

vi.mock('#models/user.model', () => ({
	default: {
		getUserBalance: vi.fn(),
		updateUserBalance: vi.fn(),
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
		getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
		getUserAgentRaw: vi.fn().mockReturnValue(null),
	},
}))

vi.mock('#utils/logger.utils', () => ({
	default: {
		error: vi.fn(),
	},
}))

import {
	createBet,
	getAdminBets,
	getBets,
	getSettlementPreview,
} from '../../../src/controllers/bets.controller.js'
import BetService from '#services/bets.service'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

describe('bets.controller getBets', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns the filtered bets list', async () => {
		const bets = [{ id: 'bet-1', label: 'Champions League', status: 'open', options: [] }]
		BetService.getBets.mockResolvedValueOnce(bets)
		const res = createResponse()

		await getBets({
			query: {
				name: 'Champions',
				status: 'open',
				sortBy: 'endsAt',
				sortOrder: 'asc',
				filterField: 'label',
				filterValue: 'League',
			},
		}, res)

		expect(BetService.getBets).toHaveBeenCalledWith(1, 20, {
			name: ['Champions'],
			status: ['open'],
			sortBy: 'endsAt',
			sortOrder: 'asc',
			filterField: 'label',
			filterValue: 'League',
		})
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith(bets)
	})

	it('returns the first 20 bets by default when no filters are provided', async () => {
		const bets = [{ id: 'bet-1' }]
		BetService.getBets.mockResolvedValueOnce(bets)
		const res = createResponse()

		await getBets({ query: {} }, res)

		expect(BetService.getBets).toHaveBeenCalledWith(1, 20, {})
		expect(res.json).toHaveBeenCalledWith(bets)
	})

	it('rejects invalid bet status filters', async () => {
		const res = createResponse()

		await getBets({
			query: {
				status: 'finished',
			},
		}, res)

		expect(BetService.getBets).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json.mock.calls[0][0].errors).toBeDefined()
	})
})

describe('bets.controller admin endpoints', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns paginated admin bets', async () => {
		BetService.countBets.mockResolvedValueOnce(25)
		BetService.getBets.mockResolvedValueOnce([{ id: 'bet-1' }])
		const res = createResponse()

		await getAdminBets({
			query: {
				page: '2',
				limit: '10',
				status: 'open',
			},
		}, res)

		expect(BetService.countBets).toHaveBeenCalledWith({ status: ['open'] })
		expect(BetService.getBets).toHaveBeenCalledWith(2, 10, { status: ['open'] })
		expect(res.json).toHaveBeenCalledWith({
			page: 2,
			limit: 10,
			totalPages: 3,
			bets: [{ id: 'bet-1' }],
		})
	})

	it('creates admin bets with options', async () => {
		BetService.createBet.mockResolvedValueOnce({
			id: 'bet-1',
			options: [{ id: 'opt-1' }, { id: 'opt-2' }],
		})
		const res = createResponse()

		await createBet({
			user: { id: '11111111-1111-1111-1111-111111111111' },
			body: {
				name: 'Champions League Winner',
				ends_at: '2026-06-01T18:00:00.000Z',
				options: [
					{ label: 'Barca', odd: 2.1 },
					{ label: 'Madrid', odd: 1.8 },
				],
			},
		}, res)

		expect(BetService.createBet).toHaveBeenCalledWith({
			label: 'Champions League Winner',
			ends_at: '2026-06-01T18:00:00.000Z',
			options: [
				{ label: 'Barca', odd: 2.1 },
				{ label: 'Madrid', odd: 1.8 },
			],
		})
		expect(res.status).toHaveBeenCalledWith(201)
	})

	it('returns a settlement preview for admin', async () => {
		BetService.getSettlementPreview.mockResolvedValueOnce({
			bet: { id: 'bet-1' },
			poolDistribution: [],
			totalPool: 0,
			winningOption: { id: '22222222-2222-2222-2222-222222222222' },
			totalWinningAmount: 0,
			totalProjectedPayout: 0,
			winners: [],
		})
		const res = createResponse()

		await getSettlementPreview({
			params: { betId: '11111111-1111-1111-1111-111111111111' },
			body: { winningOptionId: '22222222-2222-2222-2222-222222222222' },
		}, res)

		expect(BetService.getSettlementPreview).toHaveBeenCalledWith(
			'11111111-1111-1111-1111-111111111111',
			'22222222-2222-2222-2222-222222222222',
		)
		expect(res.status).toHaveBeenCalledWith(200)
	})
})
