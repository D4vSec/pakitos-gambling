import createCapyRoad from "#services/capyroad"
import User from "#models/User"
import { randomId } from "#utils/rng"

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

const startGame = async (req, res) => {
    const id = req.user.id
    const wallet = req.user.wallet
    const { amount } = req.body

    if (amount > wallet) {
        return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
    }

    const capyRoad = createCapyRoad()
    const gameID = randomId()

    try {
        await User.updateUserBalance(id, wallet - amount)

        const road = 0
        const crashProbability = 0
        const payoutMultiplier = 1
        const isCrashed = false

        const game = {
            gameID: randomId(),
            game: "capyroad",
            status: "ongoing",
            createdAt: new Date().toISOString(),
            amount,
            info: {
                road,
                crashProbability,
                payoutMultiplier,
                isCrashed,
            },
            payout: amount * payoutMultiplier,
        }

        games.set(game.gameID, game)

        return res.status(200).json(game)
    } catch (error) {
        console.error("Error starting CapyRoad game:", error)
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const jumpRoad = async (req, res) => {
    const { gameId } = req.params
    const game = games.get(gameId)

    if (!isGameValid(gameId, game)) {
        return res.status(400).json({ code: "GAME_NOT_VALID" })
    }

    const capyRoad = createCapyRoad()

    try {
        capyRoad.incrementRoad(game)
        capyRoad.incrementCrashProbability(game)
        capyRoad.incrementMultiplier(game)

        if (capyRoad.checkCrash(game)) {
            game.info.isCrashed = true
            game.status = "finished"
        }

        if (game.status === "finished") {
            if (!game.info.isCrashed) {
                try {
                    await User.updateUserBalance(req.user.id, game.payout)
                } catch (error) {
                    console.error("Error updating user balance after CapyRoad win:", error)
                }
            }
        }

        return res.status(200).json({ message: "Salto realizado", game })
    } catch (error) {
        console.error("Error processing jump in CapyRoad game:", error)
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

const destroyGame = (req, res) => {
    try {
        const { gameId } = req.params
        if (!games.has(gameId)) {
            return res.status(404).json({ code: "GAME_NOT_FOUND" })
        }

        games.delete(gameId)
        return res.status(200).json({ code: "GAME_DELETED_SUCCESSFULLY" })
    } catch (error) {
        console.error("Error destroying CapyRoad game:", error)
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

//DEV:This method is just for testing purposes, it will not be here in the final version
const getGames = (req, res) => {
    try {
        const allGames = Array.from(games.values())
        return res.status(200).json(allGames)
    } catch (error) {
        console.error("Error fetching CapyRoad games:", error)
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export default {
    startGame,
    jumpRoad,
    destroyGame,
    getGames,
}
