import createCapyRoad from "#services/capyroad.service"
import User from "#models/user.model"
import { randomId } from "#utils/rng.utils"
import logger from "#utils/logger.utils"

const games = new Map()

const isGameValid = (gameId, game) => {
    if (!games.has(gameId)) {
        return false
    }
    if (game.status === "finished") {
        return false
    }
    return true
}

const isUserGameValid = (game, userId) => {
    if (game.userId !== userId) {
        return false
    }
    return true
}

//TODO: Test the game
const startGame = async (req, res) => {
    try {
        const id = req.user.id
        const { amount } = req.body
        const numericAmount = Number(amount)

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ code: "INVALID_BET_AMOUNT" })
        }

        const wallet = await User.getUserBalance(id)

        if (wallet === null || numericAmount > wallet) {
            return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
        }

        const updatedBalance = await User.updateUserBalance(id, -numericAmount, { type: "BET" })

        if (updatedBalance === null) {
            return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
        }

        const capyRoad = createCapyRoad()
        const gameID = crypto.randomUUID()

        const road = 0
        const crashProbability = 0
        const payoutMultiplier = 1
        const isCrashed = false

        const game = {
            gameID,
            game: "capyroad",
            userId: id,
            status: "ongoing",
            createdAt: new Date().toISOString(),
            amount: numericAmount,
            info: {
                road,
                crashProbability,
                payoutMultiplier,
                isCrashed,
                multipliers: capyRoad.createMultiplierPath(payoutMultiplier),
            },
            payout: numericAmount * payoutMultiplier,
        }

        games.set(game.gameID, game)

        return res.status(200).json(game)
    } catch (error) {
        logger.error({ message: "Error starting CapyRoad game", error })
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const jumpRoad = async (req, res) => {
    const capyRoad = createCapyRoad()
    try {
        const id = req.user.id
        const { gameId } = req.params
        const game = games.get(gameId)

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        capyRoad.incrementRoad(game)
        capyRoad.incrementCrashProbability(game)

        const multiplierIndex = game.info.road
        game.info.payoutMultiplier = game.info.multipliers[multiplierIndex]

        if (capyRoad.checkCrash(game)) {
            game.info.isCrashed = true
            game.status = "finished"
            game.payout = 0
        } else {
            game.info.isCrashed = false
            game.payout = game.amount * game.info.payoutMultiplier
        }

        return res.status(200).json({ game })
    } catch (error) {
        logger.error({ message: "Error processing jump in CapyRoad game", error })
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const stand = async (req, res) => {
    try {
        const id = req.user.id
        const { gameId } = req.params
        const game = games.get(gameId)

        if (!isGameValid(gameId, game)) {
            return res.status(400).json({ code: "GAME_NOT_VALID" })
        }

        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }

        if (game.info.road === 0) {
            return res.status(400).json({ code: "CANNOT_STAND_ON_FIRST_ROAD" })
        }

        game.status = "finished"
        game.payout = game.amount * game.info.payoutMultiplier

        await User.updateUserBalance(id, game.payout, { type: "WIN" })

        return res.status(200).json({ game })
    } catch (error) {
        logger.error({ message: "Error processing stand in CapyRoad game", error })
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const destroyGame = (req, res) => {
    try {
        const { gameId } = req.params
        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }
        if (!isUserGameValid(games.get(gameId), req.user.id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }
        games.delete(gameId)
        return res.status(200).json({ code: "GAME_DELETED_SUCCESSFULLY" })
    } catch (error) {
        logger.error({ message: "Error destroying CapyRoad game", error })
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const getGame = (req, res) => {
    try {
        const id = req.user.id
        const { gameId } = req.params
        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }

        const game = games.get(gameId)
        if (!isUserGameValid(game, id)) {
            return res.status(403).json({ code: "FORBIDDEN" })
        }
        return res.status(200).json(game)
    } catch (error) {
        logger.error({ message: "Error fetching CapyRoad game", error })
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

//DEV:This method is just for testing purposes, it will not be here in the final version
const getGames = (req, res) => {
    try {
        const allGames = Array.from(games.values())
        return res.status(200).json(allGames)
    } catch (error) {
        logger.error({ message: "Error fetching CapyRoad games", error })
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export { startGame, jumpRoad, stand, destroyGame, getGame, getGames }
