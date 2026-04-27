"use strict"

export const getNumberClasses = (item) => {
  const classes = []
  classes.push(`roulette-${item.bet}`)
  classes.push(`roulette-${item.color}`)
  if (item.bet !== 0 && item.bet !== 37) {
    classes.push(item.bet % 2 === 0 ? "roulette-even" : "roulette-odd")
  }
  if (item.bet >= 1 && item.bet <= 12) classes.push("roulette-1-12")
  if (item.bet >= 13 && item.bet <= 24) classes.push("roulette-13-24")
  if (item.bet >= 25 && item.bet <= 36) classes.push("roulette-25-36")
  return classes.join(" ")
}

const isRed = (n) =>
  [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(
    n,
  )

const ROULETTE_VALUES = [
  { text: "0", type: "number", bet: 0, color: "green" },
  { text: "00", type: "number", bet: 37, color: "green" },

  ...Array.from({ length: 36 }, (_, i) => {
    const n = i + 1

    return {
      text: String(n),
      type: "number",
      bet: n,
      color: isRed(n) ? "red" : "black",
      classes: getNumberClasses({ bet: n, color: isRed(n) ? "red" : "black" }),
    }
  }),

  // external bets siguen igual
  { text: "col 1", type: "row", bet: "row1", color: "default" },
  { text: "col 2", type: "row", bet: "row2", color: "default" },
  { text: "col 3", type: "row", bet: "row3", color: "default" },
  { text: "even", type: "odd/even", bet: "even", color: "default" },
  { text: "odd", type: "odd/even", bet: "odd", color: "default" },
  { text: "1-18", type: "half", bet: "1-18", color: "default" },
  { text: "19-36", type: "half", bet: "19-36", color: "default" },
  { text: "red", type: "color", bet: "red", color: "red" },
  { text: "black", type: "color", bet: "black", color: "black" },
  { text: "1-12", type: "twelve", bet: "1-12", color: "default" },
  { text: "13-24", type: "twelve", bet: "13-24", color: "default" },
  { text: "25-36", type: "twelve", bet: "25-36", color: "default" },
]

const CHIPS = [
  {
    idSuffix: "5",
    value: 5,
    color: "#1e88e5",
    edgeColor: "#0d47a1",
    shadowColor: "#000",
  }, // Azul
  {
    idSuffix: "10",
    value: 10,
    color: "#2e7d32",
    edgeColor: "#1b5e20",
    shadowColor: "#000",
  }, // Verde
  {
    idSuffix: "25",
    value: 25,
    color: "#f4511e",
    edgeColor: "#bf360c",
    shadowColor: "#000",
  }, // Naranja
  {
    idSuffix: "50",
    value: 50,
    color: "#8e24aa",
    edgeColor: "#4a148c",
    shadowColor: "#000",
  }, // Púrpura
  {
    idSuffix: "100",
    value: 100,
    color: "#0d47a1",
    edgeColor: "#002171",
    shadowColor: "#000",
  }, // Azul muy oscuro
  {
    idSuffix: "200",
    value: 200,
    color: "#00695c",
    edgeColor: "#003d33",
    shadowColor: "#000",
  }, // Turquesa oscuro
  {
    idSuffix: "500",
    value: 500,
    color: "#c2185b",
    edgeColor: "#880e4f",
    shadowColor: "#000",
  }, // Rosa oscuro
  {
    idSuffix: "1000",
    value: 1000,
    displayValue: "1K",
    color: "#212121",
    edgeColor: "#000000",
    shadowColor: "#000000",
  },
  {
    idSuffix: "2000",
    value: 2000,
    displayValue: "2K",
    color: "#4527a0",
    edgeColor: "#311b92",
    shadowColor: "#000000",
  },
  {
    idSuffix: "5000",
    value: 5000,
    displayValue: "5K",
    color: "#5d4037",
    edgeColor: "#3e2723",
    shadowColor: "#000000",
  },
]

const BETTING_GROUPS = {
  row1: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  row2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  row3: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  even: Array.from({ length: 18 }, (_, i) => (i + 1) * 2),
  odd: Array.from({ length: 18 }, (_, i) => i * 2 + 1),
  "1-18": Array.from({ length: 18 }, (_, i) => i + 1),
  "19-36": Array.from({ length: 18 }, (_, i) => i + 19),
  "1-12": Array.from({ length: 12 }, (_, i) => i + 1),
  "13-24": Array.from({ length: 12 }, (_, i) => i + 13),
  "25-36": Array.from({ length: 12 }, (_, i) => i + 25),
  red: ROULETTE_VALUES.filter((cell) => cell.color === "red").map(
    (cell) => cell.bet,
  ),
  black: ROULETTE_VALUES.filter((cell) => cell.color === "black").map(
    (cell) => cell.bet,
  ),
}

const ROULETTE_0_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
]

const ROULETTE_00_ORDER = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, 37, 27,
  10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2,
]

const PIECE_COLORS = {
  red: {
    base: "bg-red-500",
    hover: "bg-red-400",
    hoverClass: "hover:bg-red-400",
  },
  black: {
    base: "bg-black",
    hover: "bg-gray-700",
    hoverClass: "hover:bg-gray-700",
  },
  green: {
    base: "bg-green-600",
    hover: "bg-green-500",
    hoverClass: "hover:bg-green-500",
  },
  default: {
    base: "bg-zinc-800",
    hover: "bg-zinc-600",
    hoverClass: "hover:bg-zinc-600",
  },
}

const CHIP_VALUES = CHIPS.map((chip) => chip.value)

export {
  ROULETTE_VALUES,
  ROULETTE_0_ORDER,
  ROULETTE_00_ORDER,
  CHIPS,
  CHIP_VALUES,
  BETTING_GROUPS,
  PIECE_COLORS,
}
