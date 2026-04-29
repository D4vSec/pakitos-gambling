import createRoulette from "#services/roulette"
import User from "#models/userModel"
import crypto from "crypto"
import Audit from "#services/audit"
import logger from "#utils/logger"

const spinRoulette = async (req, res) => {
    const { rouletteType, bets } = req.body

    //All the validations for the request body (I might want to move this to a middleware or something later)
    if (!["Zero", "ZeroZero"].includes(rouletteType)) {
        return res.status(400).json({ code: "INVALID_ROULETTE_TYPE" })
    }

    if (rouletteType === "Zero" && (bets.bet < 0 || bets.bet > 36)) {
        return res.status(400).json({ code: "INVALID_BET" })
    }

    if (rouletteType === "ZeroZero" && (bets.bet < 0 || bets.bet > 37)) {
        return res.status(400).json({ code: "INVALID_BET" })
    }

    if (bets.type === "color" && !["red", "black"].includes(bets.bet)) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    if (bets.type === "odd/even" && !["odd", "even"].includes(bets.bet)) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    if (
        bets.type === "twelve" &&
        !["1-12", "13-24", "25-36"].includes(bets.bet)
    ) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    if (bets.type === "row" && !["row1", "row2", "row3"].includes(bets.bet)) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    if (bets.type === "half" && !["1-18", "19-36"].includes(bets.bet)) {
        return res.status(400).json({ code: "INVALID_BET_TYPE" })
    }

    const id = req.user.id
    const wallet = await User.getUserBalance(id)

    const totalAmount = bets.reduce((acc, bet) => acc + bet.amount, 0)

    if (totalAmount > wallet) {
        return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })
    }

    const roulette = createRoulette()

    try {
        await User.updateUserBalance(id, -totalAmount, { type: "BET" })

        const winningNumber = roulette.spinRoulette(rouletteType)
        //We check each bet against the winning number and also calculate the payout for each one
        const results = await bets.map((bet) => {
            let isWinner = false
            let multiplier = 0
            const { type, bet: singleBet, amount } = bet
            if (roulette.isNumberBet(type)) {
                isWinner = roulette.isNumberWinner(singleBet, winningNumber)
                multiplier = 36
            }
            if (roulette.isColorBet(type)) {
                isWinner = roulette.isColorWinner(singleBet, winningNumber)
                multiplier = 2
            }
            if (roulette.isOddBet(type)) {
                isWinner = roulette.isOddWinner(singleBet, winningNumber)
                multiplier = 2
            }
            if (roulette.isTwelveBet(type)) {
                isWinner = roulette.isTwelveWinner(singleBet, winningNumber)
                multiplier = 3
            }
            if (roulette.isRowBet(type)) {
                isWinner = roulette.isRowWinner(singleBet, winningNumber)
                multiplier = 3
            }
            if (roulette.isHalfBet(type)) {
                isWinner = roulette.isHalfWinner(singleBet, winningNumber)
                multiplier = 2
            }

            return {
                ...bet,
                type,
                singleBet,
                amount,
                isWinner,
                payout: isWinner ? amount * multiplier : 0,
                multiplier,
            }
        })

        const totalPayout = results.reduce(
            (acc, result) => acc + result.payout,
            0,
        )

        if (totalPayout > 0) await User.updateUserBalance(id, totalPayout, { type: "WIN" })

        const color = roulette.getColor(winningNumber)

        const deviceInfo = Audit.getUserAgentRaw(req)
        Audit.createAudit({
            user_id: id,
            action: "GAME_RESULT",
            details: {
                type: "ROULETTE",
                rouletteType,
                bets,
                winningNumber: winningNumber === 37 ? "00" : winningNumber,
                color,
                payout: totalPayout,
                date: new Date().toISOString(),
            },
            ip_address: Audit.getClientIp(req),
			user_agent: deviceInfo ? JSON.stringify(deviceInfo.raw) : null,
        })
    
        res.json({
            gameId: crypto.randomUUID(),
            game: "roulette",
            rouletteType,
            status: "finished",
            createdAt: new Date().toISOString(),
            bets: results,
            result: {
                winningNumber: winningNumber === 37 ? "00" : winningNumber,
                color,
                isZero: roulette.isZero,
                isZeroZero: roulette.isZeroZero,
            },
        })
    } catch (error) {
        logger.error("Error spinning roulette:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export default spinRoulette
