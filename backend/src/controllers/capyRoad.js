import createCapyRoad from "#services/capyroad"
import User from "#models/User"
import { randomId } from "#utils/rng"
import { ca } from "zod/v4/locales"

const games = new Map()

const startGame = async (res, req) => {
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

        games.set(gameID, game)
    } catch (error) {
        console.error("Error starting CapyRoad game:", error)
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }

    games.set(gameID, game)

    return res.status(200).json({ message: "Juego iniciado", gameId: game.gameID })
}

export const jumpRoad = async (req, res) => {
    const { gameId } = req.params
    const game = games.get(gameId)

    if (!game) {
        return res.status(404).json({ code: "GAME_NOT_FOUND" })
    }

    if (game.status !== "ongoing") {
        return res.status(400).json({ code: "GAME_NOT_ONGOING" })
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
