import { randomIntInclusive } from "#utils/rng.utils"

//This factory contains all the necessary functions to manage the logic of the roulette
const createRoulette = () => {
    const twelveNumbers = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    ]

    const rowNumbers = [
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    ]

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

    const isAllowedRoulette = (type) => ["Zero", "ZeroZero"].includes(type)

    const isValidBetShape = (bet) =>
        bet && typeof bet === "object" && Number.isFinite(bet.amount) && bet.amount > 0


    const invalidBetTypeFor = (bet, rouletteType) => {
        if (isNumberBet(bet.type)) return !Number.isInteger(bet.bet) || bet.bet < 0 || bet.bet > (rouletteType === "Zero" ? 36 : 37)
        if (isColorBet(bet.type)) return !["red", "black"].includes(bet.bet)
        if (isOddBet(bet.type)) return !["odd", "even"].includes(bet.bet)
        if (isTwelveBet(bet.type)) return !["1-12", "13-24", "25-36"].includes(bet.bet)
        if (isRowBet(bet.type)) return !["row1", "row2", "row3"].includes(bet.bet)
        if (isHalfBet(bet.type)) return !["1-18", "19-36"].includes(bet.bet)
        return false
    }

    const spinRoulette = (rouletteType) => {
        if (rouletteType === "Zero") return randomIntInclusive(0, 36)
        if (rouletteType === "ZeroZero") return randomIntInclusive(0, 37) //0-36 for numbers, 37 for 00
    }
    const isZero = (type) => type === 0
    const isZeroZero = (type) => type === 37

    //The following functions check the kind of bet the player made
    const isNumberBet = (type) => type === "number"
    const isColorBet = (type) => type === "color"
    const isOddBet = (type) => type === "odd/even"
    const isTwelveBet = (type) => type === "twelve"
    const isRowBet = (type) => type === "row"
    const isHalfBet = (type) => type === "half"

    //The following functions check if the bet is a winner based on the winning number
    const isNumberWinner = (bet, winningNumber) => bet === winningNumber

    const isColorWinner = (bet, winningNumber) => {
        if (bet === "red") return redNumbers.includes(winningNumber)
        if (bet === "black") return blackNumbers.includes(winningNumber)
        return false
    }

    const isOddWinner = (bet, winningNumber) => {
        if (bet === "odd") return winningNumber % 2 === 1 && !isZeroZero(winningNumber)
        if (bet === "even") return winningNumber % 2 === 0 && !isZero(winningNumber)
        return false
    }

    const isTwelveWinner = (bet, winningNumber) => {
        if (bet === "1-12") return twelveNumbers[0].includes(winningNumber)
        if (bet === "13-24") return twelveNumbers[1].includes(winningNumber)
        if (bet === "25-36") return twelveNumbers[2].includes(winningNumber)
        return false
    }

    const isRowWinner = (bet, winningNumber) => {
        if (bet === "row1") return rowNumbers[0].includes(winningNumber)
        if (bet === "row2") return rowNumbers[1].includes(winningNumber)
        if (bet === "row3") return rowNumbers[2].includes(winningNumber)
        return false
    }

    const isHalfWinner = (bet, winningNumber) => {
        if (bet === "1-18") return winningNumber >= 1 && winningNumber <= 18
        if (bet === "19-36") return winningNumber >= 19 && winningNumber <= 36
        return false
    }

    const evaluateBet = (bet, winningNumber) => {
        let isWinner = false
        let multiplier = 0
        const { type, bet: singleBet, amount } = bet

        if (isNumberBet(type)) {
            isWinner = isNumberWinner(singleBet, winningNumber)
            multiplier = 36
        } else if (isColorBet(type)) {
            isWinner = isColorWinner(singleBet, winningNumber)
            multiplier = 2
        } else if (isOddBet(type)) {
            isWinner = isOddWinner(singleBet, winningNumber)
            multiplier = 2
        } else if (isTwelveBet(type)) {
            isWinner = isTwelveWinner(singleBet, winningNumber)
            multiplier = 3
        } else if (isRowBet(type)) {
            isWinner = isRowWinner(singleBet, winningNumber)
            multiplier = 3
        } else if (isHalfBet(type)) {
            isWinner = isHalfWinner(singleBet, winningNumber)
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

    const getColor = (winningNumber) => {
        if (redNumbers.includes(winningNumber)) return "red"
        if (blackNumbers.includes(winningNumber)) return "black"
        return "green"
    }

    return {
        spinRoulette,
        isZero,
        isZeroZero,
        isNumberWinner,
        isColorWinner,
        isOddWinner,
        isTwelveWinner,
        isRowWinner,
        isHalfWinner,
        isNumberBet,
        isColorBet,
        isOddBet,
        isTwelveBet,
        isRowBet,
        isHalfBet,
        getColor,
        isAllowedRoulette,
        isValidBetShape,
        invalidBetTypeFor,
        evaluateBet,
    }
}

export default createRoulette
