import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#services/blackjack.service', () => ({
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
		createAudit: vi.fn(),
		getClientIp: vi.fn(),
		getUserAgentRaw: vi.fn(),
	},
}))

vi.mock('#utils/logger.utils', () => ({
	default: {
		error: vi.fn(),
	},
}))

vi.mock('#utils/rng.utils', () => ({
	randomUUID: vi.fn(),
}))

import { getGame, hit, split, stand, startGame } from '../../../src/controllers/blackjack.controller.js'
import Audit from '#services/audit.service'
import User from '#models/user.model'
import createBlackJack from '#services/blackjack.service'
import { randomUUID } from '#utils/rng.utils'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

const card = (rank, suit = 'Spades') => ({ rank, suit })

const calculateHandValue = (hand) => {
	let value = 0
	let aceCount = 0

	for (const currentCard of hand) {
		if (currentCard.rank === 'A') {
			value += 11
			aceCount += 1
		} else if (['J', 'Q', 'K'].includes(currentCard.rank)) {
			value += 10
		} else {
			value += Number.parseInt(currentCard.rank, 10)
		}
	}

	while (value > 21 && aceCount > 0) {
		value -= 10
		aceCount -= 1
	}

	return value
}

const buildBlackjackMock = (initialDeck) => ({
	createDeck: vi.fn(() => initialDeck.map((currentCard) => ({ ...currentCard }))),
	shuffleDeck: vi.fn((deck) => deck),
	getInitialHand: vi.fn((deck) => [deck.shift(), deck.shift()]),
	calculateHandValue: vi.fn(calculateHandValue),
	hideDealerCard: vi.fn((_dealerHand, game) => {
		const responseGame = structuredClone(game)

		if (responseGame.status !== 'finished') {
			responseGame.dealer[0].hand[1] = { rank: 'hidden', suit: 'hidden' }
			responseGame.dealer[0].value = calculateHandValue([responseGame.dealer[0].hand[0]])
		}

		return responseGame
	}),
	hit: vi.fn((deck, hand) => [...hand, deck.shift()]),
	dealerPlay: vi.fn((deck, dealerHand) => {
		const updatedHand = [...dealerHand]

		while (calculateHandValue(updatedHand) < 17) {
			updatedHand.push(deck.shift())
		}

		return updatedHand
	}),
	setHand: vi.fn((handState) => {
		const value = calculateHandValue(handState.hand)

		return {
			...handState,
			value,
			bust: value > 21,
			blackjack: value === 21,
			resolved:
				handState.resolved === true || handState.doubled === true || value >= 21,
		}
	}),
	determinateWinner: vi.fn((playerHandValue, dealerHandValue) => {
		if (playerHandValue > 21) return 'dealer'
		if (dealerHandValue > 21) return 'player'
		if (playerHandValue > dealerHandValue) return 'player'
		if (playerHandValue < dealerHandValue) return 'dealer'
		return 'tie'
	}),
	getPayout: vi.fn((game, handNumber, natural = false) => {
		const hand = game.player[handNumber]

		if (natural && hand.blackjack) return { payout: hand.bet * 2.5, type: 'WIN' }
		if (game.winners[handNumber] === 'player') return { payout: hand.bet * 2, type: 'WIN' }
		if (game.winners[handNumber] === 'tie') return { payout: hand.bet, type: 'REFUND' }
		return { payout: 0, type: 'LOSE' }
	}),
	split: vi.fn((hand) => [[{ ...hand[0] }], [{ ...hand[1] }]]),
})

describe('blackjack.controller', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(console, 'log').mockImplementation(() => {})

		User.getUserBalance.mockResolvedValue(100)
		User.updateUserBalance.mockResolvedValue(90)
		Audit.getClientIp.mockReturnValue('203.0.113.25')
		Audit.getUserAgentRaw.mockReturnValue({ raw: { browser: 'Vitest' } })
		randomUUID.mockReturnValue('blackjack-game-id')
	})

	it('returns 400 for invalid bet amounts', async () => {
		createBlackJack.mockReturnValue(
			buildBlackjackMock([card('10'), card('7'), card('9'), card('8')]),
		)
		const res = createResponse()

		await startGame(
			{
				user: { id: 'user-1' },
				body: { amount: 0 },
			},
			res,
		)

		expect(User.updateUserBalance).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INVALID_BET_AMOUNT' })
	})

	it('creates an ongoing game, charges the bet and hides the dealer hole card', async () => {
		createBlackJack.mockReturnValue(
			buildBlackjackMock([card('10'), card('7'), card('9'), card('8'), card('5')]),
		)
		const res = createResponse()

		await startGame(
			{
				user: { id: 'user-1' },
				body: { amount: '10' },
			},
			res,
		)

		expect(User.updateUserBalance).toHaveBeenCalledWith('user-1', -10, { type: 'BET' })
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				gameId: 'blackjack-game-id',
				game: 'blackjack',
				status: 'ongoing',
				payout: 0,
			}),
		)

		const payload = res.json.mock.calls[0][0]
		expect(payload).not.toHaveProperty('deck')
		expect(payload.player[0]).toEqual(
			expect.objectContaining({
				bet: '10',
				value: 17,
			}),
		)
		expect(payload.dealer[0].hand[1]).toEqual({ rank: 'hidden', suit: 'hidden' })
		expect(payload.dealer[0].value).toBe(9)
	})

	it('settles natural blackjacks immediately, pays out and creates an audit entry', async () => {
		User.updateUserBalance
			.mockResolvedValueOnce(80)
			.mockResolvedValueOnce(130)
		createBlackJack.mockReturnValue(
			buildBlackjackMock([card('A'), card('K'), card('9'), card('7'), card('5')]),
		)
		const res = createResponse()

		await startGame(
			{
				user: { id: 'user-1' },
				body: { amount: 20 },
			},
			res,
		)

		expect(User.updateUserBalance).toHaveBeenNthCalledWith(1, 'user-1', -20, {
			type: 'BET',
		})
		expect(User.updateUserBalance).toHaveBeenNthCalledWith(2, 'user-1', 50, {
			type: 'WIN',
		})
		expect(Audit.createAudit).toHaveBeenCalledWith(
			expect.objectContaining({
				user_id: 'user-1',
				action: 'GAME_RESULT',
				details: expect.objectContaining({
					type: 'BLACKJACK',
					winners: ['player'],
					payout: 50,
				}),
				ip_address: '203.0.113.25',
				user_agent: JSON.stringify({ browser: 'Vitest' }),
			}),
		)
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				status: 'finished',
				payout: 50,
				winners: ['player'],
			}),
		)
	})

	it('forbids hitting a game that belongs to another user', async () => {
		createBlackJack.mockReturnValue(
			buildBlackjackMock([card('10'), card('7'), card('9'), card('8'), card('5')]),
		)
		const startRes = createResponse()

		await startGame(
			{
				user: { id: 'user-1' },
				body: { amount: 10 },
			},
			startRes,
		)

		const res = createResponse()
		await hit(
			{
				user: { id: 'user-2' },
				params: { gameId: 'blackjack-game-id' },
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(403)
		expect(res.json).toHaveBeenCalledWith({ code: 'FORBIDDEN' })
	})

	it('returns the stored game for the owner while keeping the dealer hole card hidden', async () => {
		createBlackJack.mockReturnValue(
			buildBlackjackMock([card('10'), card('7'), card('9'), card('8'), card('5')]),
		)
		const startRes = createResponse()

		await startGame(
			{
				user: { id: 'user-1' },
				body: { amount: 10 },
			},
			startRes,
		)

		const res = createResponse()
		await getGame(
			{
				user: { id: 'user-1' },
				params: { gameId: 'blackjack-game-id' },
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				gameId: 'blackjack-game-id',
				status: 'ongoing',
			}),
		)
		expect(res.json.mock.calls[0][0].dealer[0].hand[1]).toEqual({
			rank: 'hidden',
			suit: 'hidden',
		})
	})

	it('charges the second bet on split and settles each split hand with the correct payout', async () => {
		User.updateUserBalance
			.mockResolvedValueOnce(90)
			.mockResolvedValueOnce(80)
			.mockResolvedValueOnce(100)
			.mockResolvedValueOnce(110)
		createBlackJack.mockReturnValue(
			buildBlackjackMock([card('8'), card('8'), card('10'), card('7'), card('10'), card('9')]),
		)

		await startGame(
			{
				user: { id: 'user-1' },
				body: { amount: 10 },
			},
			createResponse(),
		)

		const splitRes = createResponse()
		await split(
			{
				user: { id: 'user-1' },
				params: { gameId: 'blackjack-game-id' },
			},
			splitRes,
		)

		expect(User.updateUserBalance).toHaveBeenNthCalledWith(2, 'user-1', -10, {
			type: 'BET',
		})
		expect(splitRes.json).toHaveBeenCalledWith(
			expect.objectContaining({
				split: true,
				player: [
					expect.objectContaining({ value: 18, bet: 10 }),
					expect.objectContaining({ value: 17, bet: 10 }),
				],
			}),
		)

		await stand(
			{
				user: { id: 'user-1' },
				params: { gameId: 'blackjack-game-id' },
			},
			createResponse(),
		)

		const finalRes = createResponse()
		await stand(
			{
				user: { id: 'user-1' },
				params: { gameId: 'blackjack-game-id' },
			},
			finalRes,
		)

		expect(User.updateUserBalance).toHaveBeenNthCalledWith(3, 'user-1', 20, {
			type: 'WIN',
		})
		expect(User.updateUserBalance).toHaveBeenNthCalledWith(4, 'user-1', 10, {
			type: 'REFUND',
		})
		expect(finalRes.json).toHaveBeenCalledWith(
			expect.objectContaining({
				status: 'finished',
				payout: 30,
				winners: ['player', 'tie'],
			}),
		)
	})
})
