import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#utils/rng.utils', () => ({
	randomInt: vi.fn(),
}))

import createBlackJack from '../../../src/services/blackjack.service.js'
import { randomInt } from '#utils/rng.utils'

const card = (rank, suit = 'Spades') => ({ rank, suit })

describe('blackjack service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('creates a standard 52-card deck with unique cards', () => {
		const blackJack = createBlackJack()
		const deck = blackJack.createDeck()

		expect(deck).toHaveLength(52)
		expect(new Set(deck.map(({ rank, suit }) => `${rank}-${suit}`)).size).toBe(52)
	})

	it('shuffles the deck using the RNG bounds expected by Fisher-Yates', () => {
		randomInt.mockReturnValue(0)
		const blackJack = createBlackJack()
		const deck = [card('A'), card('K'), card('Q')]

		expect(blackJack.shuffleDeck(deck)).toEqual([card('K'), card('Q'), card('A')])
		expect(randomInt).toHaveBeenNthCalledWith(1, 0, 3)
		expect(randomInt).toHaveBeenNthCalledWith(2, 0, 2)
	})

	it('treats aces as 1 when keeping them at 11 would bust the hand', () => {
		const blackJack = createBlackJack()

		expect(blackJack.calculateHandValue([card('A'), card('9'), card('A')])).toBe(21)
		expect(blackJack.calculateHandValue([card('A'), card('9'), card('A'), card('9')])).toBe(20)
	})

	it('hides only the dealer hole card for ongoing games without mutating the stored game', () => {
		const blackJack = createBlackJack()
		const game = {
			status: 'ongoing',
			dealer: [
				{
					hand: [card('10'), card('7', 'Hearts')],
					value: 17,
				},
			],
		}

		const responseGame = blackJack.hideDealerCard(game.dealer[0].hand, game)

		expect(responseGame.dealer[0].hand[0]).toEqual(card('10'))
		expect(responseGame.dealer[0].hand[1]).toEqual({ rank: 'hidden', suit: 'hidden' })
		expect(responseGame.dealer[0].value).toBe(10)
		expect(game.dealer[0].hand[1]).toEqual(card('7', 'Hearts'))
		expect(game.dealer[0].value).toBe(17)
	})

	it('marks doubled hands as resolved and computes their value flags', () => {
		const blackJack = createBlackJack()

		expect(
			blackJack.setHand({
				hand: [card('9'), card('2'), card('8')],
				bet: 10,
				doubled: true,
				resolved: false,
			}),
		).toEqual(
			expect.objectContaining({
				value: 19,
				bust: false,
				blackjack: false,
				resolved: true,
			}),
		)
	})

	it('returns the correct payout for natural blackjack, standard wins, ties and losses', () => {
		const blackJack = createBlackJack()
		const game = {
			status: 'finished',
			player: [
				{ bet: 20, blackjack: true, resolved: true },
				{ bet: 15, blackjack: false, doubled: false, resolved: true },
				{ bet: 30, blackjack: false, doubled: true, resolved: true },
				{ bet: 12, blackjack: false, doubled: false, resolved: true },
				{ bet: 30, blackjack: false, resolved: true },
			],
			winners: ['player', 'player', 'player', 'tie', 'dealer'],
		}

		expect(blackJack.getPayout(game, 0, true)).toEqual({ payout: 50, type: 'WIN' })
		expect(blackJack.getPayout(game, 1)).toEqual({ payout: 30, type: 'WIN' })
		expect(blackJack.getPayout(game, 2)).toEqual({ payout: 60, type: 'WIN' })
		expect(blackJack.getPayout(game, 3)).toEqual({ payout: 12, type: 'REFUND' })
		expect(blackJack.getPayout(game, 4)).toEqual({ payout: 0, type: 'LOSE' })
	})
})
