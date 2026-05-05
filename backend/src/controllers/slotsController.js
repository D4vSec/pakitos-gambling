import createSlots from "#services/slots"
import User from "#models/user.model"
import { MACHINE_TYPES } from "#config/slots"
import crypto from "crypto"
import logger from "#utils/logger"

const activeGames = new Map()

/**
 * POST /slots/create
 * Body: { type: "3x3" | "3x5" | "5x5", amount: number }
 */
const createSlot = async (req, res) => {
	if (!req.body || typeof req.body !== "object") {
		return res.status(400).json({ code: "AUTH_SLOTS_DATA_PROVIDED" })
	}

	try {
		const userId = req.user.id
		const { type = "3x5", amount } = req.body

		if (!amount || amount <= 0) {
			return res.status(400).json({ code: "INVALID_AMOUNT" })
		}

		if (!MACHINE_TYPES[type]) {
			return res.status(400).json({
				code: "INVALID_MACHINE_TYPE",
			})
		}

		const balance = await User.getUserBalance(userId)
		if (balance === null || balance < amount) {
			return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
		}

		const newBalance = await User.updateUserBalance(userId, -amount, { type: "BET" })
		if (newBalance === null) {
			return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
		}

		const game = createSlots(type)
		const gameId = crypto.randomUUID()

		activeGames.set(gameId, {
			userId,
			game,
			machineType: type,
			bet: amount,
			createdAt: new Date().toISOString(),
			spins: [],
			totalPayout: 0,
		})

		return res.json({
			gameId,
			game: "slots",
			machineType: type,
			rows: game.ROWS,
			cols: game.COLS,
			bet: amount,
			paylines: game.PAYLINES,
			balance: newBalance,
		})
	} catch (error) {
		logger.error(error)
		return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

/**
 * POST /slots/:gameId/spin
 * Spins the slot machine for an existing game session.
 * Each spin costs the original bet amount again.
 */
const spinSlot = async (req, res) => {
	try {
		const userId = req.user.id
		const { gameId } = req.params

		const session = activeGames.get(gameId)

		if (!session) {
			return res.status(404).json({ code: "GAME_NOT_FOUND" })
		}

		if (session.userId !== userId) {
			return res.status(403).json({ code: "NO_PERMISSION" })
		}

		const { game, bet } = session

		const balance = await User.getUserBalance(userId)
		if (balance === null || balance < bet) {
			return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
		}

		const newBalance = await User.updateUserBalance(userId, -bet, { type: "BET" })
		if (newBalance === null) {
			return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
		}

		const result = game.spin(bet)

		let finalBalance = newBalance
		if (result.payout > 0) {
			finalBalance = await User.updateUserBalance(userId, bet + result.payout, { type: "WIN" })
		}

		session.spins.push({
			spinNumber: session.spins.length + 1,
			grid: result.grid,
			winningLines: result.winningLines,
			payout: result.payout,
			isWinner: result.isWinner,
			timestamp: new Date().toISOString(),
		})
		session.totalPayout += result.payout

		return res.json({
			gameId,
			game: "slots",
			machineType: session.machineType,
			spinNumber: session.spins.length,
			bet,
			grid: result.grid,
			winningLines: result.winningLines,
			payout: result.payout,
			isWinner: result.isWinner,
			balance: finalBalance,
		})
	} catch (error) {
		logger.error(error)
		return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

/**
 * GET /slots/:gameId
 * Returns the current state of a slot session.
 */
const getSlotSession = async (req, res) => {
	try {
		const userId = req.user.id
		const { gameId } = req.params

		const session = activeGames.get(gameId)

		if (!session) {
			return res.status(404).json({ code: "GAME_NOT_FOUND" })
		}

		if (session.userId !== userId) {
			return res.status(403).json({ code: "NO_PERMISSION" })
		}

		return res.json({
			gameId,
			game: "slots",
			machineType: session.machineType,
			bet: session.bet,
			totalSpins: session.spins.length,
			totalPayout: session.totalPayout,
			createdAt: session.createdAt,
			spins: session.spins,
		})
	} catch (error) {
		logger.error(error)
		return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

/**
 * DELETE /slots/:gameId
 * Ends and cleans up a slot session.
 */
const endSlotSession = async (req, res) => {
	try {
		const userId = req.user.id
		const { gameId } = req.params

		const session = activeGames.get(gameId)

		if (!session) {
			return res.status(404).json({ code: "GAME_NOT_FOUND" })
		}

		if (session.userId !== userId) {
			return res.status(403).json({ code: "NO_PERMISSION" })
		}

		const summary = {
			gameId,
			game: "slots",
			machineType: session.machineType,
			bet: session.bet,
			totalSpins: session.spins.length,
			totalPayout: session.totalPayout,
			netResult: session.totalPayout - session.bet * session.spins.length,
			createdAt: session.createdAt,
			endedAt: new Date().toISOString(),
		}

		activeGames.delete(gameId)

		return res.json(summary)
	} catch (error) {
		logger.error(error)
		return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

export { createSlot, spinSlot, getSlotSession, endSlotSession }
