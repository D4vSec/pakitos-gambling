import { randomFloatInRange, randomIntInclusive } from "#utils/rng.utils"

// Cross-Road game chicken from stake
const createCapyRoad = () => {
    const maxMultiplier = 3 // tope x3
    const multiplierPathLength = 10

    const roundMultiplier = (value) => Math.round(value * 100) / 100

    const createMultiplierPath = (startMultiplier = 1, length = multiplierPathLength) => {
        const steps = Math.max(2, Number(length) || multiplierPathLength)
        const start = roundMultiplier(Math.max(1, Number(startMultiplier || 1)))
        const curve = randomFloatInRange(0.65, 1.25)
        const volatility = randomFloatInRange(0.03, 0.1)
        const path = []

        if (start >= maxMultiplier) {
            return Array.from({ length: steps }, () => maxMultiplier)
        }

        for (let index = 0; index < steps; index++) {
            if (index === 0) {
                path.push(start)
                continue
            }

            const progress = index / (steps - 1)
            const easedProgress = Math.pow(progress, curve)
            const baseMultiplier = start + (maxMultiplier - start) * easedProgress
            const noiseWindow = (maxMultiplier - start) * volatility * progress * (1 - progress)
            const noisyMultiplier = baseMultiplier + randomFloatInRange(-noiseWindow, noiseWindow)
            const previousMultiplier = path[path.length - 1]
            const nextMultiplier = Math.min(
                maxMultiplier,
                Math.max(previousMultiplier + 0.01, noisyMultiplier),
            )
            path.push(roundMultiplier(nextMultiplier))
        }

        path[path.length - 1] = maxMultiplier
        return path
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
        return randomIntInclusive(0, 99) < game.info.crashProbability
    }
    return {
        createMultiplierPath,
        incrementRoad,
        incrementCrashProbability,
        checkCrash,
    }
}

export default createCapyRoad
