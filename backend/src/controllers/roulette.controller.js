import createRoulette from "#services/roulette.service"
import User from "#models/user.model"
import crypto from "crypto"
import Audit from "#services/audit.service"
import logger from "#utils/logger.utils"

const spinRoulette = async (req, res) => {
    const { rouletteType, bets } = req.body
    const normalizedBets = Array.isArray(bets) ? bets : [bets]

    const isAllowedRoulette = (rt) => ["Zero", "ZeroZero"].includes(rt)

    const isValidBetShape = (bet) => bet && typeof bet === "object" && Number.isFinite(bet.amount) && bet.amount > 0

    const numberBetOutOfRange = (bet, rt) => {
        if (bet.type !== "number") return false
        const max = rt === "Zero" ? 36 : 37
        return !Number.isInteger(bet.bet) || bet.bet < 0 || bet.bet > max
    }

    const invalidBetTypeFor = (bet) => {
        if (bet.type === "color") return !["red", "black"].includes(bet.bet)
        if (bet.type === "odd/even") return !["odd", "even"].includes(bet.bet)
        if (bet.type === "twelve") return !["1-12", "13-24", "25-36"].includes(bet.bet)
        if (bet.type === "row") return !["row1", "row2", "row3"].includes(bet.bet)
        if (bet.type === "half") return !["1-18", "19-36"].includes(bet.bet)
        return false
    }

    if (!isAllowedRoulette(rouletteType)) return res.status(400).json({ code: "INVALID_ROULETTE_TYPE" })

    if (normalizedBets.some((b) => !isValidBetShape(b))) return res.status(400).json({ code: "INVALID_BET" })

    if (normalizedBets.some((b) => numberBetOutOfRange(b, rouletteType))) return res.status(400).json({ code: "INVALID_BET" })

    if (normalizedBets.some((b) => invalidBetTypeFor(b))) return res.status(400).json({ code: "INVALID_BET_TYPE" })

    const id = req.user.id
    const wallet = await User.getUserBalance(id)
    const totalAmount = normalizedBets.reduce((acc, b) => acc + b.amount, 0)

    if (totalAmount > wallet) return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })

    const roulette = createRoulette()

    const evaluateBet = (bet, winningNumber) => {
        let isWinner = false
        let multiplier = 0
        const { type, bet: singleBet, amount } = bet

        if (roulette.isNumberBet(type)) {
            isWinner = roulette.isNumberWinner(singleBet, winningNumber)
            multiplier = 36
        } else if (roulette.isColorBet(type)) {
            isWinner = roulette.isColorWinner(singleBet, winningNumber)
            multiplier = 2
        } else if (roulette.isOddBet(type)) {
            isWinner = roulette.isOddWinner(singleBet, winningNumber)
            multiplier = 2
        } else if (roulette.isTwelveBet(type)) {
            isWinner = roulette.isTwelveWinner(singleBet, winningNumber)
            multiplier = 3
        } else if (roulette.isRowBet(type)) {
            isWinner = roulette.isRowWinner(singleBet, winningNumber)
            multiplier = 3
        } else if (roulette.isHalfBet(type)) {
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
    }

    try {
        await User.updateUserBalance(id, -totalAmount, { type: "BET" })

        const winningNumber = roulette.spinRoulette(rouletteType)
        const results = normalizedBets.map((b) => evaluateBet(b, winningNumber))

        const totalPayout = results.reduce((acc, r) => acc + r.payout, 0)

        if (totalPayout > 0) await User.updateUserBalance(id, totalPayout, { type: "WIN" })

        const color = roulette.getColor(winningNumber)

        const deviceInfo = Audit.getUserAgentRaw(req)
        Audit.createAudit({
            user_id: id,
            action: "GAME_RESULT",
            details: {
                type: "ROULETTE",
                rouletteType,
                bets: normalizedBets,
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
                isZero: roulette.isZero(winningNumber),
                isZeroZero: roulette.isZeroZero(winningNumber),
            },
        })
    } catch (error) {
        logger.error("Error spinning roulette:", error)
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export default spinRoulette
