import { randomFloat, randomFloatInRange, randomInt } from "#utils/rng"

// Cross-Road game chicken from stake
const createCapyRoad = () => {
    const createGame = () => {
        const road = 0
        const crash = 0
        const multiplier = 1
        const isCrashed = false
    }
    //This function will increment the multiplier of the next road
    const incrementMultiplier = (multiplier) => {
        const increment = randomFloatInRange(0, 1) / 100
        return multiplier + increment
    }

    const incrementRoad = (road) => {
        return road + 1
    }
    

    return {}
}

export default createCapyRoad
