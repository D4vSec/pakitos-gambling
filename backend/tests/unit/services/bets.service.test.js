import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#models/bets.model', () => ({
	default: {
		findBets: vi.fn(),
		getUserBetSelections: vi.fn(),
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
			{ id: 'bet-1', label: 'Final', options: [] },
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
				options: [],
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
})
