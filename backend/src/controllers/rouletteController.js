import createRoulette from "#services/roulette"
import User from "#models/userModel"
import crypto from "crypto"

const spinRoulette = (req, res) => {
    const { type, bet, amount } = req.body
    const id = req.user.id
    const wallet = User.getUserBalance(id)

    if (amount > wallet) {
        return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
    }

    const roulette = createRoulette()

    try {
        User.updateUserBalance(id, -amount)

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

        if (payout > 0) User.updateUserBalance(id, payout)

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
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export default spinRoulette
