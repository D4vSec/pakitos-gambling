//TODO: Implement the game logic
import { createRoulette } from "../services/roulette.js"

const roulette = createRoulette()
//TODO: All the wallet logic
export const spinRoulette = (req, res) => {
    try {
        const { type, bet, amount } = req.body
        const wallet = null //I will take this from the DB
        const winningNumber = roulette.spinRoulette()

        let isWinner = false
        let multiplier = 0
        if (roulette.isNumberBet(type)) {
            isWinner = roulette.isNumberWinner(bet, winningNumber)
            multiplier = 36
        }
        if (roulette.isColorBet(type)) {
            isWinner = roulette.isColorWinner(bet, winningNumber)
            multiplier = 2
        }
        if (roulette.isOddBet(type)) {
            isWinner = roulette.isOddWinner(bet, winningNumber)
            multiplier = 2
        }
        if (roulette.isTwelveBet(type)) {
            isWinner = roulette.isTwelveWinner(bet, winningNumber)
            multiplier = 3
        }
        if (roulette.isRowBet(type)) {
            isWinner = roulette.isRowWinner(bet, winningNumber)
            multiplier = 3
        }

        const payout = isWinner ? amount * multiplier : 0

        const color = roulette.isColorWinner("red", winningNumber)
            ? "red"
            : roulette.isColorWinner("black", winningNumber)
              ? "black"
              : "green"

        res.json({
            gameId: crypto.randomUUID(),
            game: "roulette",
            status: "finished",
            createdAt: new Date().toISOString(),
            bet: { type, selection: bet, amount },
            result: {
                winningNumber: winningNumber === 37 ? "00" : winningNumber,
                color,
                isZero: roulette.isZero,
                isZeroZero: roulette.isZeroZero,
            },
            outcome: {
                isWinner,
                multiplier,
                payout,
            },
        })
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message })
    }
}
