import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('#utils/rng', () => ({
	randomIntInclusive: vi.fn(),
}))

import createRoulette from '../../../src/services/roulette.service.js'
import { randomIntInclusive } from '#utils/rng'

describe('roulette service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('spins standard roulette with an inclusive 0-36 range', () => {
		randomIntInclusive.mockReturnValueOnce(36)
		const roulette = createRoulette()

		expect(roulette.spinRoulette('Zero')).toBe(36)
		expect(randomIntInclusive).toHaveBeenCalledWith(0, 36)
	})

	it('spins double-zero roulette with an inclusive 0-37 range', () => {
		randomIntInclusive.mockReturnValueOnce(37)
		const roulette = createRoulette()

		expect(roulette.spinRoulette('ZeroZero')).toBe(37)
		expect(randomIntInclusive).toHaveBeenCalledWith(0, 37)
	})

	it('identifies colors and green slots correctly', () => {
		const roulette = createRoulette()

		expect(roulette.isColorWinner('red', 1)).toBe(true)
		expect(roulette.isColorWinner('black', 2)).toBe(true)
		expect(roulette.getColor(0)).toBe('green')
		expect(roulette.getColor(37)).toBe('green')
	})

	it('treats zero and double zero as neither odd nor even wins', () => {
		const roulette = createRoulette()

		expect(roulette.isOddWinner('odd', 0)).toBe(false)
		expect(roulette.isOddWinner('even', 0)).toBe(false)
		expect(roulette.isOddWinner('odd', 37)).toBe(false)
	})

	it('resolves dozens, rows and halves correctly', () => {
		const roulette = createRoulette()

		expect(roulette.isTwelveWinner('13-24', 20)).toBe(true)
		expect(roulette.isRowWinner('row3', 30)).toBe(true)
		expect(roulette.isHalfWinner('19-36', 22)).toBe(true)
	})
})
