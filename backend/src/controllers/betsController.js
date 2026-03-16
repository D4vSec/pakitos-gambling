import Bets from "#models/betsModel"
import User from "#models/userModel"

const getBets = async (req, res) => {
	try {
		const bets = await Bets.getBets()
		res.status(200).json(bets)
	} catch (error) {
		console.error("Error loading bets:", error)
		res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

const getBetInfo = async (req, res) => {
	const { betId } = req.params
	try {
		const betInfo = await Bets.getBetInfo(betId)
		res.status(200).json(betInfo)
	} catch (error) {
		console.error(`Error loading bet info from bet ${betId}:`, error)
		res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

const deleteBet = async (req, res) => {
	const { betId } = req.params
	try {
		await Bets.deleteBet(betId)
		res.status(200).json({ code: "SUCCESS" })
	} catch (error) {
		console.error(`Error deleting bet ${betId}:`, error)
		res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

const updateBet = async (req, res) => {
	const { betId } = req.params
	const { name, description, ends_at } = req.body
	try {
		await Bets.updateBet(betId, name, description, ends_at)
		res.status(200).json({ code: "SUCCESS" })
	} catch (error) {
		console.error(`Error updating bet ${betId}:`, error)
		res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

const placeBet = async (req, res) => {
	const { betId } = req.params
	const { amount } = req.body
	const userId = req.user.id

	try {
		const bet = await Bets.getBetById(betId)

		if (amount <= 0) {
			return res.status(400).json({ code: "INVALID_BET_AMOUNT" })
		}

		if (!bet) {
			return res.status(404).json({ code: "BET_NOT_FOUND" })
		}

		if (new Date(bet.ends_at) < new Date()) {
			return res.status(400).json({ code: "BET_CLOSED" })
		}

		const balance = await User.getUserBalance(userId)
		if (balance === null || balance < amount) {
			return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
		}

		const newBalance = await User.updateUserBalance(userId, -amount)
		if (newBalance === null) {
			return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
		}

		const userBet = await Bets.placeBet(userId, betId, amount)
		res.status(201).json(userBet)
	} catch (error) {
		console.error(`Error placing bet on bet ${betId}:`, error)
		res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
	}
}

export { getBets, getBetInfo, placeBet, deleteBet, updateBet }
