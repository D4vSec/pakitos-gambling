import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('node:crypto', () => ({
	default: {
		randomInt: vi.fn(),
		randomBytes: vi.fn(),
		randomUUID: vi.fn(),
	},
}))

import crypto from 'node:crypto'

import {
	randomFloat,
	randomFloatInRange,
	randomId,
	randomInt,
	randomIntInclusive,
	randomUUID,
	shuffle,
} from '../../../src/utils/rng.utils.js'

describe('rng utils', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('delegates randomInt to node crypto with a half-open range', () => {
		crypto.randomInt.mockReturnValueOnce(7)

		expect(randomInt(3, 8)).toBe(7)
		expect(crypto.randomInt).toHaveBeenCalledWith(3, 8)
	})

	it('rejects non integer ranges and inverted bounds', () => {
		expect(() => randomInt(1.2, 5)).toThrow(TypeError)
		expect(() => randomInt(5, 5)).toThrow(RangeError)
		expect(() => randomInt(6, 5)).toThrow(RangeError)
	})

	it('delegates randomIntInclusive with an inclusive max', () => {
		crypto.randomInt.mockReturnValueOnce(9)

		expect(randomIntInclusive(2, 8)).toBe(9)
		expect(crypto.randomInt).toHaveBeenCalledWith(2, 9)
	})

	it('builds random floats from 4 random bytes', () => {
		const readUInt32BE = vi.fn().mockReturnValue(0xffffffff)
		crypto.randomBytes.mockReturnValueOnce({ readUInt32BE })

		expect(randomFloat()).toBe(1)
		expect(crypto.randomBytes).toHaveBeenCalledWith(4)
		expect(readUInt32BE).toHaveBeenCalledWith(0)
	})

	it('maps randomFloat into a numeric range', () => {
		crypto.randomBytes.mockReturnValueOnce({ readUInt32BE: () => 0 })

		expect(randomFloatInRange(10, 20)).toBe(10)
		expect(crypto.randomBytes).toHaveBeenCalledWith(4)
	})

	it('generates hex ids of the requested length', () => {
		const toString = vi.fn().mockReturnValue('abcd')
		crypto.randomBytes.mockReturnValueOnce({ toString })

		expect(randomId(2)).toBe('abcd')
		expect(crypto.randomBytes).toHaveBeenCalledWith(2)
		expect(toString).toHaveBeenCalledWith('hex')
	})

	it('delegates UUID generation to node crypto', () => {
		crypto.randomUUID.mockReturnValueOnce('game-uuid')

		expect(randomUUID()).toBe('game-uuid')
		expect(crypto.randomUUID).toHaveBeenCalledTimes(1)
	})

	it('shuffles without mutating the original array', () => {
		crypto.randomInt
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(0)

		const input = ['a', 'b', 'c']
		const output = shuffle(input)

		expect(input).toEqual(['a', 'b', 'c'])
		expect(output).toEqual(['b', 'c', 'a'])
		expect(crypto.randomInt).toHaveBeenCalledWith(0, 3)
		expect(crypto.randomInt).toHaveBeenCalledWith(0, 2)
	})
})
