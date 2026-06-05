import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#services/roulette.service', () => ({
	default: vi.fn(),
}))

vi.mock('#models/user.model', () => ({
	default: {
		getUserBalance: vi.fn(),
		updateUserBalance: vi.fn(),
	},
}))

vi.mock('#services/audit.service', () => ({
	default: {
		getUserAgentRaw: vi.fn(),
		getClientIp: vi.fn(),
		createAudit: vi.fn(),
	},
}))

vi.mock('#utils/logger.utils', () => ({
	default: {
		error: vi.fn(),
	},
}))

vi.mock('#utils/rng.utils', () => ({
	randomUUID: vi.fn(() => 'roulette-game-id'),
}))

import spinRoulette from '../../../src/controllers/roulette.controller.js'
import createRoulette from '#services/roulette.service'
import User from '#models/user.model'
import Audit from '#services/audit.service'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

const createRouletteMock = (winningNumber = 7) => ({
	isAllowedRoulette: vi.fn((type) => ['Zero', 'ZeroZero'].includes(type)),
	isValidBetShape: vi.fn((bet) => bet && typeof bet === 'object' && Number.isFinite(bet.amount) && bet.amount > 0),
	invalidBetTypeFor: vi.fn((bet, rouletteType) => {
		if (bet.type === 'number') return !Number.isInteger(bet.bet) || bet.bet < 0 || bet.bet > (rouletteType === 'Zero' ? 36 : 37)
		if (bet.type === 'color') return !['red', 'black'].includes(bet.bet)
		return false
	}),
	spinRoulette: vi.fn(() => winningNumber),
	isNumberBet: vi.fn((type) => type === 'number'),
	isColorBet: vi.fn((type) => type === 'color'),
	isOddBet: vi.fn((type) => type === 'odd/even'),
	isTwelveBet: vi.fn((type) => type === 'twelve'),
	isRowBet: vi.fn((type) => type === 'row'),
	isHalfBet: vi.fn((type) => type === 'half'),
	isNumberWinner: vi.fn((bet, result) => bet === result),
	isColorWinner: vi.fn(() => false),
	isOddWinner: vi.fn(() => false),
	isTwelveWinner: vi.fn(() => false),
	isRowWinner: vi.fn(() => false),
	isHalfWinner: vi.fn(() => false),
	getColor: vi.fn(() => 'red'),
	isZero: vi.fn((value) => value === 0),
	isZeroZero: vi.fn((value) => value === 37),
	evaluateBet: vi.fn((bet, result) => ({
		...bet,
		singleBet: bet.bet,
		isWinner: bet.type === 'number' ? bet.bet === result : false,
		payout: bet.type === 'number' && bet.bet === result ? bet.amount * 36 : 0,
		multiplier: bet.type === 'number' ? 36 : 0,
	})),
})

describe('roulette.controller', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		User.getUserBalance.mockResolvedValue(100)
		User.updateUserBalance.mockResolvedValue(90)
		Audit.getUserAgentRaw.mockReturnValue({ raw: { browser: 'Vitest' } })
		Audit.getClientIp.mockReturnValue('203.0.113.25')
		createRoulette.mockReturnValue(createRouletteMock())
	})

	it('returns 400 for invalid roulette types', async () => {
		const res = createResponse()

		await spinRoulette(
			{
				user: { id: 'user-1' },
				body: {
					rouletteType: 'TripleZero',
					bets: [{ type: 'number', bet: 7, amount: 10 }],
				},
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INVALID_ROULETTE_TYPE' })
	})

	it('returns 400 for invalid bet types', async () => {
		const res = createResponse()

		await spinRoulette(
			{
				user: { id: 'user-1' },
				body: {
					rouletteType: 'Zero',
					bets: [{ type: 'color', bet: 'blue', amount: 10 }],
				},
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INVALID_BET_TYPE' })
	})

	it('returns 400 when the user balance is insufficient', async () => {
		User.getUserBalance.mockResolvedValueOnce(5)
		const res = createResponse()

		await spinRoulette(
			{
				user: { id: 'user-1' },
				body: {
					rouletteType: 'Zero',
					bets: [{ type: 'number', bet: 7, amount: 10 }],
				},
			},
			res,
		)

		expect(User.updateUserBalance).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INSUFFICIENT_BALANCE' })
	})

	it('registers BET and WIN transactions for winning spins', async () => {
		const roulette = createRouletteMock(7)
		createRoulette.mockReturnValueOnce(roulette)
		User.updateUserBalance
			.mockResolvedValueOnce(90)
			.mockResolvedValueOnce(450)

		const res = createResponse()
		const req = {
			user: { id: 'user-1' },
			body: {
				rouletteType: 'Zero',
				bets: [{ type: 'number', bet: 7, amount: 10 }],
			},
		}

		await spinRoulette(req, res)

		expect(User.updateUserBalance).toHaveBeenNthCalledWith(1, 'user-1', -10, {
			type: 'BET',
		})
		expect(User.updateUserBalance).toHaveBeenNthCalledWith(2, 'user-1', 360, {
			type: 'WIN',
		})
		expect(Audit.createAudit).toHaveBeenCalledWith(
			expect.objectContaining({
				user_id: 'user-1',
				action: 'GAME_RESULT',
				details: expect.objectContaining({
					type: 'ROULETTE',
					rouletteType: 'Zero',
					winningNumber: 7,
					color: 'red',
					payout: 360,
					bets: [{ type: 'number', bet: 7, amount: 10 }],
				}),
				ip_address: '203.0.113.25',
				user_agent: JSON.stringify({ browser: 'Vitest' }),
			}),
		)
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				gameId: 'roulette-game-id',
				game: 'roulette',
				rouletteType: 'Zero',
				status: 'finished',
				bets: [
					expect.objectContaining({
						type: 'number',
						singleBet: 7,
						amount: 10,
					}),
				],
				result: {
					winningNumber: 7,
					color: 'red',
					isZero: false,
					isZeroZero: false,
				},
			}),
		)
		expect(res.json.mock.calls[0][0].bets[0]).toEqual(
			expect.objectContaining({
				type: 'number',
				singleBet: 7,
				amount: 10,
				isWinner: true,
				payout: 360,
				multiplier: 36,
			}),
		)
	})

	it('registers only BET transactions for losing spins', async () => {
		const roulette = createRouletteMock(5)
		createRoulette.mockReturnValueOnce(roulette)
		const res = createResponse()

		await spinRoulette(
			{
				user: { id: 'user-1' },
				body: {
					rouletteType: 'Zero',
					bets: [{ type: 'number', bet: 7, amount: 10 }],
				},
			},
			res,
		)

		expect(User.updateUserBalance).toHaveBeenCalledTimes(1)
		expect(User.updateUserBalance).toHaveBeenCalledWith('user-1', -10, {
			type: 'BET',
		})
		expect(Audit.createAudit).toHaveBeenCalledWith(
			expect.objectContaining({
				details: expect.objectContaining({
					payout: 0,
				}),
			}),
		)
		expect(res.json.mock.calls[0][0].bets[0]).toEqual(
			expect.objectContaining({
				isWinner: false,
				payout: 0,
				multiplier: 36,
			}),
		)
	})
})
