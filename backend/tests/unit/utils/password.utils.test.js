import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('argon2', () => ({
	default: {
		hash: vi.fn(),
		verify: vi.fn(),
		argon2id: 'argon2id',
	},
}))

import argon2 from 'argon2'

import { comparePassword, hashPassword } from '../../../src/utils/password.utils.js'

describe('password utils', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('hashes passwords with the expected argon2 options', async () => {
		argon2.hash.mockResolvedValueOnce('hashed-password')

		await expect(hashPassword('secret123')).resolves.toBe('hashed-password')

		expect(argon2.hash).toHaveBeenCalledWith('secret123', {
			type: 'argon2id',
			memoryCost: 2 ** 16,
			timeCost: 3,
			parallelism: 1,
		})
	})

	it('compares passwords through argon2 verify', async () => {
		argon2.verify.mockResolvedValueOnce(true)

		await expect(comparePassword('hashed-password', 'secret123')).resolves.toBe(true)

		expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'secret123')
	})

	it('throws when argon2 hash fails', async () => {
		argon2.hash.mockRejectedValueOnce(new Error('fail'))

		await expect(hashPassword('secret123')).rejects.toThrow('fail')
	})
})
