import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fakeCache, sessions } = vi.hoisted(() => {
	const sessions = new Map()

	return {
		sessions,
		fakeCache: {
			set: vi.fn((key, value) => {
				sessions.set(key, value)
				return value
			}),
			get: vi.fn((key) => sessions.get(key)),
			delete: vi.fn((key) => sessions.delete(key)),
		},
	}
})

vi.mock('#services/slots.service', () => ({
	default: vi.fn(),
}))

vi.mock('#models/user.model', () => ({
	default: {
		getUserBalance: vi.fn(),
		updateUserBalance: vi.fn(),
	},
}))

vi.mock('#utils/cache.utils', () => ({
	default: vi.fn(() => fakeCache),
}))

vi.mock('#utils/logger.utils', () => ({
	default: {
		error: vi.fn(),
	},
}))

vi.mock('#utils/rng.utils', () => ({
	randomUUID: vi.fn(),
}))

import {
	createSlot,
	endSlotSession,
	getSlotSession,
	spinSlot,
} from '../../../src/controllers/slots.controller.js'
import createSlots from '#services/slots.service'
import User from '#models/user.model'
import { randomUUID } from '#utils/rng.utils'

const createResponse = () => ({
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
})

const createGameMock = (spinResult = null) => ({
	ROWS: 3,
	COLS: 5,
	PAYLINES: [{ id: 'H_ROW0', positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] }],
	spin: vi.fn(() => spinResult),
})

describe('slots.controller', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		sessions.clear()

		User.getUserBalance.mockResolvedValue(100)
		User.updateUserBalance.mockResolvedValue(90)
		randomUUID.mockReturnValue('slots-game-id')
		createSlots.mockReturnValue(createGameMock())
	})

	it('returns 400 when the request body is missing', async () => {
		const res = createResponse()

		await createSlot({ user: { id: 'user-1' } }, res)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'AUTH_SLOTS_DATA_PROVIDED' })
	})

	it('returns 400 for invalid bet amounts', async () => {
		const res = createResponse()

		await createSlot(
			{
				user: { id: 'user-1' },
				body: { type: '3x5', amount: 0 },
			},
			res,
		)

		expect(User.getUserBalance).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INVALID_AMOUNT' })
	})

	it('returns 400 for unsupported machine types', async () => {
		const res = createResponse()

		await createSlot(
			{
				user: { id: 'user-1' },
				body: { type: '4x4', amount: 10 },
			},
			res,
		)

		expect(createSlots).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ code: 'INVALID_MACHINE_TYPE' })
	})

	it('creates a slot session after charging the opening bet', async () => {
		const res = createResponse()

		await createSlot(
			{
				user: { id: 'user-1' },
				body: { type: '3x5', amount: 10 },
			},
			res,
		)

		expect(User.getUserBalance).toHaveBeenCalledWith('user-1')
		expect(User.updateUserBalance).toHaveBeenCalledWith('user-1', -10, { type: 'BET' })
		expect(createSlots).toHaveBeenCalledWith('3x5')
		expect(fakeCache.set).toHaveBeenCalledWith(
			'slots-game-id',
			expect.objectContaining({
				userId: 'user-1',
				game: expect.objectContaining({ ROWS: 3, COLS: 5 }),
				machineType: '3x5',
				bet: 10,
				spins: [],
				totalPayout: 0,
			}),
			expect.any(Number),
		)
		expect(res.json).toHaveBeenCalledWith({
			gameId: 'slots-game-id',
			game: 'slots',
			machineType: '3x5',
			rows: 3,
			cols: 5,
			bet: 10,
			paylines: [{ id: 'H_ROW0', positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] }],
			balance: 90,
		})
	})

	it('returns 404 when spinning a missing session', async () => {
		const res = createResponse()

		await spinSlot(
			{
				user: { id: 'user-1' },
				params: { gameId: 'missing-game' },
			},
			res,
		)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({ code: 'GAME_NOT_FOUND' })
	})

	it('spins an existing session, stores the spin and credits winners', async () => {
		const spinResult = {
			grid: [['seven', 'seven', 'seven']],
			winningLines: [{ paylineId: 'H_ROW0', symbol: 'seven', lineMultiplier: 100 }],
			payout: 50,
			isWinner: true,
		}
		const game = createGameMock(spinResult)
		sessions.set('slots-game-id', {
			userId: 'user-1',
			game,
			machineType: '3x5',
			bet: 10,
			createdAt: '2026-06-05T00:00:00.000Z',
			spins: [],
			totalPayout: 0,
		})
		User.updateUserBalance
			.mockResolvedValueOnce(80)
			.mockResolvedValueOnce(140)
		const res = createResponse()

		await spinSlot(
			{
				user: { id: 'user-1' },
				params: { gameId: 'slots-game-id' },
			},
			res,
		)

		expect(User.updateUserBalance).toHaveBeenNthCalledWith(1, 'user-1', -10, { type: 'BET' })
		expect(User.updateUserBalance).toHaveBeenNthCalledWith(2, 'user-1', 60, { type: 'WIN' })
		expect(game.spin).toHaveBeenCalledWith(10)
		expect(sessions.get('slots-game-id')).toEqual(
			expect.objectContaining({
				totalPayout: 50,
				spins: [
					expect.objectContaining({
						spinNumber: 1,
						grid: [['seven', 'seven', 'seven']],
						payout: 50,
						isWinner: true,
					}),
				],
			}),
		)
		expect(res.json).toHaveBeenCalledWith({
			gameId: 'slots-game-id',
			game: 'slots',
			machineType: '3x5',
			spinNumber: 1,
			bet: 10,
			grid: [['seven', 'seven', 'seven']],
			winningLines: [{ paylineId: 'H_ROW0', symbol: 'seven', lineMultiplier: 100 }],
			payout: 50,
			isWinner: true,
			balance: 140,
		})
	})

	it('returns the session state only to the owner', async () => {
		sessions.set('slots-game-id', {
			userId: 'user-1',
			game: createGameMock(),
			machineType: '3x3',
			bet: 5,
			createdAt: '2026-06-05T00:00:00.000Z',
			spins: [{ spinNumber: 1, payout: 0, isWinner: false }],
			totalPayout: 0,
		})

		const forbiddenRes = createResponse()
		await getSlotSession(
			{
				user: { id: 'user-2' },
				params: { gameId: 'slots-game-id' },
			},
			forbiddenRes,
		)

		expect(forbiddenRes.status).toHaveBeenCalledWith(403)
		expect(forbiddenRes.json).toHaveBeenCalledWith({ code: 'NO_PERMISSION' })

		const res = createResponse()
		await getSlotSession(
			{
				user: { id: 'user-1' },
				params: { gameId: 'slots-game-id' },
			},
			res,
		)

		expect(res.json).toHaveBeenCalledWith({
			gameId: 'slots-game-id',
			game: 'slots',
			machineType: '3x3',
			bet: 5,
			totalSpins: 1,
			totalPayout: 0,
			createdAt: '2026-06-05T00:00:00.000Z',
			spins: [{ spinNumber: 1, payout: 0, isWinner: false }],
		})
	})

	it('ends the session and returns the accumulated summary', async () => {
		sessions.set('slots-game-id', {
			userId: 'user-1',
			game: createGameMock(),
			machineType: '3x5',
			bet: 10,
			createdAt: '2026-06-05T00:00:00.000Z',
			spins: [
				{ spinNumber: 1, payout: 50, isWinner: true },
				{ spinNumber: 2, payout: 0, isWinner: false },
			],
			totalPayout: 50,
		})
		const res = createResponse()

		await endSlotSession(
			{
				user: { id: 'user-1' },
				params: { gameId: 'slots-game-id' },
			},
			res,
		)

		expect(fakeCache.delete).toHaveBeenCalledWith('slots-game-id')
		expect(sessions.has('slots-game-id')).toBe(false)
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				gameId: 'slots-game-id',
				game: 'slots',
				machineType: '3x5',
				bet: 10,
				totalSpins: 2,
				totalPayout: 50,
				netResult: 30,
				createdAt: '2026-06-05T00:00:00.000Z',
				endedAt: expect.any(String),
			}),
		)
	})
})
