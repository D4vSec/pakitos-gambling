import { randomFloat, randomFloatInRange, randomId, randomInt, randomIntInclusive } from "#utils/rng.utils"

// Cross-Road game chicken from stake
const createCapyRoad = () => {
    //This will go to the controller
    const createGame = () => {
        
    }
    //This function will increment the multiplier of the next road
    const incrementMultiplier = (game) => {
        const maxMultiplier = 3 // tope x3

        const crashProb = Number(game.info.crashProbability || 0)
        const survivalProb = Math.max(Math.min((100 - crashProb) / 100, 0.99), 0.01)
        const targetMultiplier = Math.min(1 / survivalProb, maxMultiplier)

        const current = Number(game.info.payoutMultiplier || 1)

        const diff = targetMultiplier - current
        const minStep = 0.22
        const step = Math.max(diff * 1.1, minStep)

        let newMultiplier = current + step
        if (newMultiplier > targetMultiplier) newMultiplier = targetMultiplier

        game.info.payoutMultiplier = Math.min(newMultiplier, maxMultiplier)
        game.info.payoutMultiplier = Math.round(game.info.payoutMultiplier * 100) / 100
    }

    const incrementRoad = (game) => {
        game.info.road = (game.info.road || 0) + 1
    }

    const incrementCrashProbability = (game) => {
        const baseIncrease = randomIntInclusive(5, 12)
        const roadFactor = Math.floor((game.info.road || 0) * 0.8)
        const increment = baseIncrease + roadFactor
        game.info.crashProbability = Math.min(Number(game.info.crashProbability || 0) + increment, 100)
    }

    const checkCrash = (game) => {
        return randomIntInclusive(0, 99) < (game.info.crashProbability || 0)
    }
    return {
        incrementMultiplier,
        incrementRoad,
        incrementCrashProbability,
        checkCrash,
    }
}

export default createCapyRoad
