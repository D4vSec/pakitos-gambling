import { randomFloat, randomFloatInRange, randomInt } from "#utils/rng"

// Cross-Road game chicken from stake
const createCapyRoad = () => {
    const createGame = () => {
        let road = 0
        let crashProbability = 0
        let payoutMultiplier = 1
        let isCrashed = false
    }
    //This function will increment the multiplier of the next road
    const incrementMultiplier = (multiplier) => {
        const increment = randomFloatInRange(0, 1) / 100
        return multiplier + increment
    }

    const incrementRoad = (road) => {
        return road + 1
    }
    
    const incrementCrashProbability = (crashProbability) => {
        const increment = randomIntInclusive(0, 10) / 100
        return crashProbability + increment
    }

    return {}
}

export default createCapyRoad
