import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/bets.model', () => ({
	default: {
		deleteBet: vi.fn(),
		getBetInfo: vi.fn(),
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
		getBetsForUser: vi.fn(),
		getSettlementPreview: vi.fn(),
		hasBetActivity: vi.fn(),
		placeBet: vi.fn(),
		settleBet: vi.fn(),
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
	placeBet,
	settleBet,
} from '../../../src/controllers/bets.controller.js'
import BetService from '#services/bets.service'
import Bets from '#models/bets.model'
import logger from '#utils/logger.utils'

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
		BetService.getBetsForUser.mockResolvedValueOnce(bets)
		const res = createResponse()

		await getBets({
			user: { id: '11111111-1111-1111-1111-111111111111' },
			query: {
				name: 'Champions',
				status: 'open',
				sortBy: 'endsAt',
				sortOrder: 'asc',
				filterField: 'label',
				filterValue: 'League',
			},
		}, res)

		expect(BetService.getBetsForUser).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111', 1, 20, {
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
		BetService.getBetsForUser.mockResolvedValueOnce(bets)
		const res = createResponse()

		await getBets({ user: { id: '11111111-1111-1111-1111-111111111111' }, query: {} }, res)

		expect(BetService.getBetsForUser).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111', 1, 20, {})
		expect(res.json).toHaveBeenCalledWith(bets)
	})

	it('rejects invalid bet status filters', async () => {
		const res = createResponse()

		await getBets({
			user: { id: '11111111-1111-1111-1111-111111111111' },
			query: {
				status: 'finished',
			},
		}, res)

		expect(BetService.getBetsForUser).not.toHaveBeenCalled()
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

	describe('bets.controller placeBet', () => {
		beforeEach(() => {
			vi.clearAllMocks()
		})

		it('places a bet successfully', async () => {
			const optionId = '22222222-2222-2222-2222-222222222222'
			const betId = '11111111-1111-1111-1111-111111111111'
			const userBet = {
				id: '33333333-3333-3333-3333-333333333333',
				bet_id: betId,
				option_label: 'Madrid',
				odd: 1.8,
			}
			const res = createResponse()

			BetService.placeBet.mockResolvedValueOnce(userBet)
			BetService.updateOddsForBet.mockResolvedValueOnce([])

			await placeBet({
				params: { betId },
				body: {
					betOptionId: optionId,
					amount: 100,
				},
				user: { id: '44444444-4444-4444-4444-444444444444' },
				socket: { remoteAddress: '127.0.0.1' },
			}, res)

			expect(BetService.placeBet).toHaveBeenCalledWith(
				'44444444-4444-4444-4444-444444444444',
				betId,
				optionId,
				100,
			)
			expect(BetService.updateOddsForBet).toHaveBeenCalledWith(betId)
			expect(res.status).toHaveBeenCalledWith(201)
			expect(res.json).toHaveBeenCalledWith(userBet)
		})

		it('still returns the stored user bet odd when odds recalculation fails after storing the bet', async () => {
			const optionId = '22222222-2222-2222-2222-222222222222'
			const betId = '11111111-1111-1111-1111-111111111111'
			const userBet = {
				id: '33333333-3333-3333-3333-333333333333',
				bet_id: betId,
				option_label: 'Madrid',
				odd: 2.75,
			}
			const res = createResponse()

			BetService.placeBet.mockResolvedValueOnce(userBet)
			BetService.updateOddsForBet.mockRejectedValueOnce(new Error('ODDS_FAILED'))

			await placeBet({
				params: { betId },
				body: {
					betOptionId: optionId,
					amount: 100,
				},
				user: { id: '44444444-4444-4444-4444-444444444444' },
				socket: { remoteAddress: '127.0.0.1' },
			}, res)

			expect(logger.error).toHaveBeenCalledWith(
				expect.objectContaining({
					message: expect.stringContaining('odds update failed'),
				}),
			)
			expect(res.status).toHaveBeenCalledWith(201)
			expect(res.json).toHaveBeenCalledWith(userBet)
		})

		it('rejects placing a second bet on the same market', async () => {
			const res = createResponse()

			BetService.placeBet.mockResolvedValueOnce({
				code: 'BET_ALREADY_PLACED_ON_MARKET',
				existingBetId: '33333333-3333-3333-3333-333333333333',
				existingBetOptionId: '22222222-2222-2222-2222-222222222222',
				existingOptionLabel: 'Madrid',
			})

			await placeBet({
				params: { betId: '11111111-1111-1111-1111-111111111111' },
				body: {
					betOptionId: '22222222-2222-2222-2222-222222222222',
					amount: 100,
				},
				user: { id: '44444444-4444-4444-4444-444444444444' },
			}, res)

			expect(res.status).toHaveBeenCalledWith(409)
			expect(res.json).toHaveBeenCalledWith({
				code: 'BET_ALREADY_PLACED_ON_MARKET',
				existingBetId: '33333333-3333-3333-3333-333333333333',
				existingBetOptionId: '22222222-2222-2222-2222-222222222222',
				existingOptionLabel: 'Madrid',
			})
			expect(BetService.updateOddsForBet).not.toHaveBeenCalled()
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

	it('settles a bet for admin', async () => {
		BetService.settleBet.mockResolvedValueOnce({
			bet: { id: '11111111-1111-1111-1111-111111111111', status: 'closed' },
			poolDistribution: [],
			totalPool: 100,
			winningOption: { id: '22222222-2222-2222-2222-222222222222', label: 'Barca' },
			totalWinningAmount: 50,
			totalProjectedPayout: 110,
			winners: [],
			settledAt: '2026-06-01T18:00:00.000Z',
		})
		const res = createResponse()

		await settleBet({
			params: { betId: '11111111-1111-1111-1111-111111111111' },
			body: { winningOptionId: '22222222-2222-2222-2222-222222222222' },
			user: { id: '33333333-3333-3333-3333-333333333333' },
			socket: { remoteAddress: '127.0.0.1' },
		}, res)

		expect(BetService.settleBet).toHaveBeenCalledWith(
			'11111111-1111-1111-1111-111111111111',
			'22222222-2222-2222-2222-222222222222',
			{
				adminUserId: '33333333-3333-3333-3333-333333333333',
				ipAddress: '127.0.0.1',
				userAgent: null,
			},
		)
		expect(res.status).toHaveBeenCalledWith(200)
	})
})
