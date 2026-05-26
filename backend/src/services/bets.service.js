import Bets from "#models/bets.model"
import logger from "#utils/logger.utils"

const calculateOdds = (poolDistribution) => {
    const totalPool = poolDistribution.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
    )

    if (totalPool === 0) {
        return poolDistribution.map((item) => ({
            ...item,
            odd: item.odd ? Number(item.odd) : 2.0,
        }))
    }

    return poolDistribution.map((item) => {
        const amount = Number(item.amount)
        const percentage = amount / totalPool

        let odd
        if (percentage === 0) {
            odd = 100.0
        } else {
            odd = 1 / percentage
        }

        odd *= 0.95

        return {
            ...item,
            odd: Number(odd.toFixed(2)),
        }
    })
}

const updateOddsForBet = async (betId) => {
    try {
        const poolDistribution = await Bets.getPoolDistribution(betId)

        const newOdds = calculateOdds(poolDistribution)

        for (const option of newOdds) {
            await Bets.updateOptionOdd(option.id, option.odd)
        }

        return newOdds
    } catch (error) {
        logger.error(`Error updating odds for bet ${betId}:`, error)
        throw error
    }
}

const getBets = async (page = 1, limit = 20, filters = {}) => Bets.findBets(page, limit, filters)
const countBets = async (filters = {}) => Bets.countBets(filters)
const hasBetActivity = async (betId) => Bets.hasBetActivity(betId)
const createBet = async (payload) => Bets.createBetWithOptions(payload)
const placeBet = async (userId, betId, betOptionId, amount) => Bets.placeBetForUser(userId, betId, betOptionId, amount)
const updateBet = async (betId, payload) => Bets.updateBet(betId, payload)
const deleteBet = async (betId) => Bets.deleteBet(betId)
const closeBet = async (betId) => Bets.closeBet(betId)
const settleBet = async (betId, winningOptionId, metadata = {}) => Bets.settleBet(betId, winningOptionId, metadata)

const getAdminBet = async (betId) => {
    const [bet, options, poolDistribution, settlement] = await Promise.all([
        Bets.getBetById(betId),
        Bets.getBetInfo(betId),
        Bets.getPoolDistribution(betId),
        Bets.getBetSettlement(betId),
    ])

    if (!bet) return null

    const totalPool = poolDistribution.reduce(
        (sum, option) => sum + Number(option.amount || 0),
        0,
    )

    return {
        bet,
        options,
        poolDistribution,
        totalPool: Number(totalPool.toFixed(2)),
        settlement: settlement
            ? {
                bet,
                poolDistribution,
                totalPool: Number(totalPool.toFixed(2)),
                ...settlement,
            }
            : null,
    }
}

const getSettlementPreview = async (betId, winningOptionId) => {
    const [bet, poolDistribution, settlement] = await Promise.all([
        Bets.getBetById(betId),
        Bets.getPoolDistribution(betId),
        Bets.getSettlementPreview(betId, winningOptionId),
    ])

    if (!bet || !settlement) return null

    const totalPool = poolDistribution.reduce(
        (sum, option) => sum + Number(option.amount || 0),
        0,
    )
    const totalWinningAmount = settlement.winners.reduce(
        (sum, winner) => sum + Number(winner.amount || 0),
        0,
    )
    const totalProjectedPayout = settlement.winners.reduce(
        (sum, winner) => sum + Number(winner.payout || 0),
        0,
    )

    return {
        bet,
        poolDistribution,
        totalPool: Number(totalPool.toFixed(2)),
        winningOption: settlement.winningOption,
        totalWinningAmount: Number(totalWinningAmount.toFixed(2)),
        totalProjectedPayout: Number(totalProjectedPayout.toFixed(2)),
        winners: settlement.winners.map((winner) => ({
            ...winner,
            amount: Number(Number(winner.amount || 0).toFixed(2)),
            payout: Number(Number(winner.payout || 0).toFixed(2)),
        })),
    }
}

export default {
    calculateOdds,
    closeBet,
    countBets,
    createBet,
    deleteBet,
    getAdminBet,
    getBets,
    getSettlementPreview,
    hasBetActivity,
    placeBet,
    settleBet,
    updateBet,
    updateOddsForBet,
}
