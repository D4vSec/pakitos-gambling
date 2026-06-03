import createRoulette from "#services/roulette.service"
import User from "#models/user.model"
import Audit from "#services/audit.service"
import logger from "#utils/logger.utils"
import { randomUUID } from "#utils/rng.utils"

const spinRoulette = async (req, res) => {
    const id = req.user.id
    const wallet = await User.getUserBalance(id)

    const { rouletteType, bets } = req.body
    if (Array.isArray(bets) && bets.length === 0)
        return res.status(400).json({ code: "INVALID_BETS_FORMAT" })
    const totalAmount = bets.reduce((acc, b) => acc + b.amount, 0)

    if (totalAmount > wallet) return res.status(400).json({ code: "INSUFFICIENT_BALANCE" })

    const roulette = createRoulette()

    if (!roulette.isAllowedRoulette(rouletteType))
        return res.status(400).json({ code: "INVALID_ROULETTE_TYPE" })

    if (bets.some((bet) => !roulette.isValidBetShape(bet)))
        return res.status(400).json({ code: "INVALID_BET" })

    if (bets.some((b) => roulette.invalidBetTypeFor(b, rouletteType)))
        return res.status(400).json({ code: "INVALID_BET_TYPE" })

    try {
        await User.updateUserBalance(id, -totalAmount, { type: "BET" })

        const winningNumber = roulette.spinRoulette(rouletteType)
        const results = bets.map((bet) => roulette.evaluateBet(bet, winningNumber))

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
            gameId: randomUUID(),
            game: "roulette",
            rouletteType,
            status: "finished",
            createdAt: new Date().toISOString(),
            bets: results,
            result: {
                winningNumber: winningNumber === 37 ? "00" : winningNumber,
                color,
                isZero: roulette.isZero(winningNumber),
                isZeroZero:
                    rouletteType === "ZeroZero" ? roulette.isZeroZero(winningNumber) : false,
            },
        })
    } catch (error) {
        console.error(error.message)
        //logger.error({ message: "Error spinning roulette", error })
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" })
    }
}

export default spinRoulette
