import createSlots from "#services/slots"
import User from "#models/userModel"
import { MACHINE_TYPES } from "#config/slots"
import crypto from "crypto"

const activeGames = new Map()

/**
 * POST /slots/create
 * Body: { type: "3x3" | "3x5" | "5x5", amount: number }
 */
const createSlot = async (req, res) => {
	try {
		const userId = req.user.id
		const { type = "3x5", amount } = req.body

		if (!amount || amount <= 0) {
			return res
				.status(400)
				.json({ code: "INVALID_AMOUNT", message: "Amount must be greater than 0" })
		}

		if (!MACHINE_TYPES[type]) {
			return res.status(400).json({
				code: "INVALID_MACHINE_TYPE",
				message: `Invalid machine type. Valid types: ${Object.keys(MACHINE_TYPES).join(", ")}`,
			})
		}

		const balance = await User.getUserBalance(userId)
		if (balance === null || balance < amount) {
			return res
				.status(400)
				.json({ code: "INSUFFICIENT_FUNDS", message: "Insufficient funds" })
		}

		const newBalance = await User.updateUserBalance(userId, -amount)
		if (newBalance === null) {
			return res
				.status(400)
				.json({ code: "INSUFFICIENT_FUNDS", message: "Insufficient funds" })
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
		console.error(error)
		return res
			.status(500)
			.json({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" })
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
			return res
				.status(404)
				.json({ code: "GAME_NOT_FOUND", message: "Game session not found" })
		}

		if (session.userId !== userId) {
			return res
				.status(403)
				.json({ code: "FORBIDDEN", message: "This game does not belong to you" })
		}

		const { game, bet } = session

		// Check and deduct balance for this spin
		const balance = await User.getUserBalance(userId)
		if (balance === null || balance < bet) {
			return res
				.status(400)
				.json({ code: "INSUFFICIENT_FUNDS", message: "Insufficient funds" })
		}

		const newBalance = await User.updateUserBalance(userId, -bet)
		if (newBalance === null) {
			return res
				.status(400)
				.json({ code: "INSUFFICIENT_FUNDS", message: "Insufficient funds" })
		}

		const result = game.spin(bet)

		// Credit payout to the user if they won
		let finalBalance = newBalance
		if (result.payout > 0) {
			finalBalance = await User.updateUserBalance(userId, result.payout)
		}

		// Track spin in the session
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
		console.error(error)
		return res
			.status(500)
			.json({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" })
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
			return res
				.status(404)
				.json({ code: "GAME_NOT_FOUND", message: "Game session not found" })
		}

		if (session.userId !== userId) {
			return res
				.status(403)
				.json({ code: "FORBIDDEN", message: "This game does not belong to you" })
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
		console.error(error)
		return res
			.status(500)
			.json({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" })
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
			return res
				.status(404)
				.json({ code: "GAME_NOT_FOUND", message: "Game session not found" })
		}

		if (session.userId !== userId) {
			return res
				.status(403)
				.json({ code: "FORBIDDEN", message: "This game does not belong to you" })
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
		console.error(error)
		return res
			.status(500)
			.json({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" })
	}
}

export { createSlot, spinSlot, getSlotSession, endSlotSession }
