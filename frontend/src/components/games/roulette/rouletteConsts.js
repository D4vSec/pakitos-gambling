"use strict"

const ROULETTE_VALUES = [
  // Numbers
  { text: "0", type: "number", bet: 0, color: "green" },
  { text: "00", type: "number", bet: 37, color: "green" },
  { text: "1", type: "number", bet: 1, color: "red" },
  { text: "2", type: "number", bet: 2, color: "black" },
  { text: "3", type: "number", bet: 3, color: "red" },
  { text: "4", type: "number", bet: 4, color: "black" },
  { text: "5", type: "number", bet: 5, color: "red" },
  { text: "6", type: "number", bet: 6, color: "black" },
  { text: "7", type: "number", bet: 7, color: "red" },
  { text: "8", type: "number", bet: 8, color: "black" },
  { text: "9", type: "number", bet: 9, color: "red" },
  { text: "10", type: "number", bet: 10, color: "black" },
  { text: "11", type: "number", bet: 11, color: "black" },
  { text: "12", type: "number", bet: 12, color: "red" },
  { text: "13", type: "number", bet: 13, color: "black" },
  { text: "14", type: "number", bet: 14, color: "red" },
  { text: "15", type: "number", bet: 15, color: "black" },
  { text: "16", type: "number", bet: 16, color: "red" },
  { text: "17", type: "number", bet: 17, color: "black" },
  { text: "18", type: "number", bet: 18, color: "red" },
  { text: "19", type: "number", bet: 19, color: "red" },
  { text: "20", type: "number", bet: 20, color: "black" },
  { text: "21", type: "number", bet: 21, color: "red" },
  { text: "22", type: "number", bet: 22, color: "black" },
  { text: "23", type: "number", bet: 23, color: "red" },
  { text: "24", type: "number", bet: 24, color: "black" },
  { text: "25", type: "number", bet: 25, color: "red" },
  { text: "26", type: "number", bet: 26, color: "black" },
  { text: "27", type: "number", bet: 27, color: "red" },
  { text: "28", type: "number", bet: 28, color: "black" },
  { text: "29", type: "number", bet: 29, color: "black" },
  { text: "30", type: "number", bet: 30, color: "red" },
  { text: "31", type: "number", bet: 31, color: "black" },
  { text: "32", type: "number", bet: 32, color: "red" },
  { text: "33", type: "number", bet: 33, color: "black" },
  { text: "34", type: "number", bet: 34, color: "red" },
  { text: "35", type: "number", bet: 35, color: "black" },
  { text: "36", type: "number", bet: 36, color: "red" },

  // External bets
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

export { ROULETTE_VALUES, CHIPS, CHIP_VALUES, BETTING_GROUPS, PIECE_COLORS }
