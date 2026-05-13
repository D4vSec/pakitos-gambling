import Bets from "#models/bets.model"
import User from "#models/user.model"
import BetService from "#services/bets.service"
import Audit from "#services/audit.service"
import logger from "#utils/logger.utils"

const getBets = async (req, res) => {
    try {
        const bets = await Bets.getBets()
        res.status(200).json(bets)
    } catch (error) {
        logger.error({ message: "Error loading bets:", error })
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const getBetInfo = async (req, res) => {
    const { betId } = req.params
    try {
        const betInfo = await Bets.getBetInfo(betId)
        res.status(200).json(betInfo)
    } catch (error) {
        logger.error({ message: `Error loading bet info for bet ${betId}:`, error })
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const deleteBet = async (req, res) => {
    const { betId } = req.params
    try {
        await Bets.deleteBet(betId)
        res.status(200).json({ code: "SUCCESS" })
    } catch (error) {
        logger.error({ message: `Error deleting bet ${betId}:`, error })
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
        logger.error({ message: `Error updating bet ${betId}:`, error })
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const placeBet = async (req, res) => {
    const { betOptionId } = req.body
    const { amount } = req.body
    const userId = req.user.id

    try {
        // Validar si existe la opción
        const options = await Bets.getOptionsByOptionId(betOptionId)
        if (!options || options.length === 0) {
            return res.status(404).json({ code: "OPTION_NOT_FOUND" })
        }

        const option = options.find((o) => o.id === betOptionId)
        const betId = option.bet_id

        const betInfo = await Bets.getBetById(betId)

        if (amount <= 0) {
            return res.status(400).json({ code: "INVALID_BET_AMOUNT" })
        }

        if (new Date(betInfo.ends_at) < new Date()) {
            return res.status(400).json({ code: "BET_CLOSED" })
        }

        const balance = await User.getUserBalance(userId)
        if (balance === null || balance < amount) {
            return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
        }

        const newBalance = await User.updateUserBalance(userId, -amount, { type: "BET" })
        if (newBalance === null) {
            return res.status(400).json({ code: "INSUFFICIENT_FUNDS" })
        }

        const userBet = await Bets.placeBet(userId, betOptionId, amount)

        await BetService.updateOddsForBet(betId)

        const deviceInfo = Audit.getUserAgentRaw(req)
        Audit.createAudit({
            user_id: userId,
            action: "BET_PLACED",
            details: {
                betId,
                betOptionId,
                amount,
                date: new Date().toISOString(),
            },
            ip_address: Audit.getClientIp(req),
            user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
        })

        res.status(201).json(userBet)
    } catch (error) {
        logger.error({ message: `Error placing bet on option ${betOptionId}:`, error })
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export { getBets, getBetInfo, placeBet, deleteBet, updateBet }
