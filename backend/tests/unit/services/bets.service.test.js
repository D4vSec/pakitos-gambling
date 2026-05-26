import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/bets.model', () => ({
	default: {
		findBets: vi.fn(),
		getPoolDistribution: vi.fn(),
		getUserBetSelections: vi.fn(),
		updateOptionOdds: vi.fn(),
	},
}))

import betsService from '../../../src/services/bets.service.js'
import Bets from '#models/bets.model'

describe('bets service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('attaches the user bet to each returned market', async () => {
		Bets.findBets.mockResolvedValueOnce([
			{
				id: 'bet-1',
				label: 'Final',
				options: [
					{ id: 'opt-1', label: 'Madrid', odd: 1.2 },
				],
			},
			{ id: 'bet-2', label: 'Semi', options: [] },
		])
		Bets.getUserBetSelections.mockResolvedValueOnce([
			{
				id: 'user-bet-1',
				bet_id: 'bet-1',
				bet_option_id: 'opt-1',
				option_label: 'Madrid',
				amount: '100',
				odd: '1.8',
			},
		])

		await expect(
			betsService.getBetsForUser('user-1', 1, 20, {}),
		).resolves.toEqual([
			{
				id: 'bet-1',
				label: 'Final',
				options: [
					{ id: 'opt-1', label: 'Madrid', odd: 1.2 },
				],
				hasUserBet: true,
				userBet: {
					id: 'user-bet-1',
					betOptionId: 'opt-1',
					optionLabel: 'Madrid',
					amount: 100,
					odd: 1.8,
				},
			},
			{
				id: 'bet-2',
				label: 'Semi',
				options: [],
				hasUserBet: false,
				userBet: null,
			},
		])

		expect(Bets.findBets).toHaveBeenCalledWith(1, 20, {})
		expect(Bets.getUserBetSelections).toHaveBeenCalledWith('user-1', ['bet-1', 'bet-2'])
	})

	it('keeps the existing odd for options with no pool money and clamps active options to the minimum odd', () => {
		expect(
			betsService.calculateOdds([
				{ id: 'opt-1', amount: 100, odd: 2.3 },
				{ id: 'opt-2', amount: 0, odd: 1.94 },
			]),
		).toEqual([
			{ id: 'opt-1', amount: 100, odd: 1.01 },
			{ id: 'opt-2', amount: 0, odd: 1.94 },
		])
	})

	it('resets previously broken 95.00 odds back to a safe default when the option has no pool money', () => {
		expect(
			betsService.calculateOdds([
				{ id: 'opt-1', amount: 25, odd: 2.3 },
				{ id: 'opt-2', amount: 0, odd: 95 },
			]),
		).toEqual([
			{ id: 'opt-1', amount: 25, odd: 1.01 },
			{ id: 'opt-2', amount: 0, odd: 2 },
		])
	})

	it('updates odds atomically using the recalculated set', async () => {
		Bets.getPoolDistribution.mockResolvedValueOnce([
			{ id: 'opt-1', amount: 80, odd: 2.3 },
			{ id: 'opt-2', amount: 20, odd: 1.94 },
		])
		Bets.updateOptionOdds.mockResolvedValueOnce(undefined)

		await expect(
			betsService.updateOddsForBet('bet-1'),
		).resolves.toEqual([
			{ id: 'opt-1', amount: 80, odd: 1.19 },
			{ id: 'opt-2', amount: 20, odd: 4.75 },
		])

		expect(Bets.getPoolDistribution).toHaveBeenCalledWith('bet-1')
		expect(Bets.updateOptionOdds).toHaveBeenCalledWith([
			{ id: 'opt-1', amount: 80, odd: 1.19 },
			{ id: 'opt-2', amount: 20, odd: 4.75 },
		])
	})
})
