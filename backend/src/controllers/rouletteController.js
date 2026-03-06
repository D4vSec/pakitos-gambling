import createRoulette from "#services/roulette"
import User from "#models/userModel"
import crypto from "crypto"

const spinRoulette = async (req, res) => {
    const { rouletteType, type, bet, amount } = req.body

    //All the validations for the request body (I might want to move this to a middleware or something later)
    if (!["Zero", "ZeroZero"].includes(rouletteType)) {
        return res.status(400).json({ code: "INVALID_ROULETTE_TYPE" })
    }

    if (rouletteType === "Zero" && (bet < 0 || bet > 36)) {
        return res.status(400).json({ code: "INVALID_BET" })
    }

    if (rouletteType === "ZeroZero" && (bet < 0 || bet > 37)) {
        return res.status(400).json({ code: "INVALID_BET" })
    }

    if (type === "color" && !["red", "black"].includes(bet)) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    if (type === "odd/even" && !["odd", "even"].includes(bet)) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    if (type === "twelve" && !["1-12", "13-24", "25-36"].includes(bet)) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    if (type === "row" && !["row1", "row2", "row3"].includes(bet)) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    const id = req.user.id
    const wallet = await User.getUserBalance(id)

    if (amount > wallet) {
        return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
    }

    const roulette = createRoulette()

    try {
        await User.updateUserBalance(id, -amount)

        const winningNumber = roulette.spinRoulette(rouletteType)

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

        if (payout > 0) await User.updateUserBalance(id, payout)

        const color = roulette.getColor(winningNumber)

        res.json({
            gameId: crypto.randomUUID(),
            game: "roulette",
            rouletteType,
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
