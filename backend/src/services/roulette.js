import { randomInt } from "#utils/rng"

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

  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ]
  const blackNumbers = [
    2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
  ]

  const spinRoulette = (rouletteType) => {
    if (rouletteType === "Zero") return randomInt(0, 36)
    if (rouletteType === "ZeroZero") return randomInt(0, 37) //0-36 for numbers, 37 for 00
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
    if (bet === "odd")
      return winningNumber % 2 === 1 && !isZeroZero(winningNumber)
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
  }
}

export default createRoulette
