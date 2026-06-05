import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#utils/rng.utils', () => ({
	randomInt: vi.fn(),
}))

import createSlots from '../../../src/services/slots.service.js'
import { randomInt } from '#utils/rng.utils'

describe('slots service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('rejects unknown machine types', () => {
		expect(() => createSlots('4x4')).toThrow(/Unknown machine type/)
	})

	it('retries reel generation when the excluded symbol is selected again', () => {
		randomInt.mockReturnValueOnce(0).mockReturnValueOnce(40)
		const slots = createSlots('3x3')

		expect(slots.spinReel('cherry')).toBe('lemon')
		expect(randomInt).toHaveBeenCalledTimes(2)
	})

	it('evaluates a completed payline with the correct consecutive scale', () => {
		const slots = createSlots('3x3')
		const winningGrid = [
			['bar', 'bar', 'bar'],
			['lemon', 'orange', 'plum'],
			['cherry', 'bell', 'seven'],
		]
		const payline = slots.PAYLINES.find(({ id }) => id === 'H_ROW0')

		expect(slots.evaluateLine(winningGrid, payline)).toEqual({
			paylineId: 'H_ROW0',
			symbol: 'bar',
			consecutive: 3,
			basePayout: 30,
			consecutiveScale: 1,
			lineMultiplier: 30,
		})
	})

	it('returns null for lines that do not meet the minimum consecutive symbols', () => {
		const slots = createSlots('3x5')
		const grid = [
			['cherry', 'cherry', 'cherry', 'cherry', 'lemon'],
			['lemon', 'orange', 'plum', 'bell', 'bar'],
			['orange', 'plum', 'bell', 'bar', 'seven'],
		]
		const payline = slots.PAYLINES.find(({ id }) => id === 'H_ROW0')

		expect(slots.evaluateLine(grid, payline)).toBeNull()
	})

	it('applies the house edge and payout cap when summing winning lines', () => {
		const slots = createSlots('3x5')

		expect(
			slots.calculatePayout([{ lineMultiplier: 0.5 }, { lineMultiplier: 1.8 }], 10),
		).toBe(21)
		expect(slots.calculatePayout([{ lineMultiplier: 1000 }], 10)).toBe(5000)
	})

	it('spins a full grid and reports winners from the evaluated paylines', () => {
		randomInt
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(40)
			.mockReturnValueOnce(68)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(40)
			.mockReturnValueOnce(68)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(40)
			.mockReturnValueOnce(68)

		const slots = createSlots('3x3')
		const result = slots.spin(10)

		expect(result).toEqual({
			machineType: '3x3',
			rows: 3,
			cols: 3,
			grid: [
				['cherry', 'cherry', 'cherry'],
				['lemon', 'lemon', 'lemon'],
				['orange', 'orange', 'orange'],
			],
			winningLines: [
				{
					paylineId: 'H_ROW0',
					symbol: 'cherry',
					consecutive: 3,
					basePayout: 0.5,
					consecutiveScale: 1,
					lineMultiplier: 0.5,
				},
				{
					paylineId: 'H_ROW1',
					symbol: 'lemon',
					consecutive: 3,
					basePayout: 0.8,
					consecutiveScale: 1,
					lineMultiplier: 0.8,
				},
				{
					paylineId: 'H_ROW2',
					symbol: 'orange',
					consecutive: 3,
					basePayout: 1.8,
					consecutiveScale: 1,
					lineMultiplier: 1.8,
				},
			],
			payout: 29,
			isWinner: true,
		})
	})
})
