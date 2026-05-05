import db from "#config/db.config"
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

export default {
    calculateOdds,
    updateOddsForBet,
}
