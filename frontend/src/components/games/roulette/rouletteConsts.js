"use strict"

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

const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
])

const getColor = (n) => (RED_NUMBERS.has(n) ? "red" : "black")

const buildClasses = ({ bet, color, type }) => {
  const classes = []

  classes.push(`roulette${bet}`)

  if (color) {
    classes.push(`r-group-${color}`)
  }

  const colorConfig = PIECE_COLORS[color] || PIECE_COLORS.default
  classes.push(colorConfig.base)
  if (colorConfig?.hoverClass) {
    classes.push(colorConfig.hoverClass)
  }

  if (type !== "number") {
    return classes.join(" ")
  }

  if (bet === 0 || bet === 37) {
    return classes.join(" ")
  }

  classes.push(bet % 2 === 0 ? "r-group-even" : "r-group-odd")

  if (bet <= 18) classes.push("r-group-1-18")
  else classes.push("r-group-19-36")

  if (bet <= 12) classes.push("r-group-1-12")
  else if (bet <= 24) classes.push("r-group-13-24")
  else classes.push("r-group-25-36")

  if ((bet - 1) % 3 === 0) classes.push("r-group-row1")
  else if ((bet - 2) % 3 === 0) classes.push("r-group-row2")
  else classes.push("r-group-row3")

  return classes.join(" ")
}

const ROULETTE_00_VALUES = [
  {
    text: "0",
    type: "number",
    bet: 0,
    color: "green",
    classes: buildClasses({ bet: 0, color: "green", type: "number" }),
  },
  {
    text: "00",
    type: "number",
    bet: 37,
    color: "green",
    classes: buildClasses({ bet: 37, color: "green", type: "number" }),
  },
  ...Array.from({ length: 36 }, (_, i) => {
    const n = i + 1
    const color = getColor(n)
    return {
      text: String(n),
      type: "number",
      bet: n,
      color,
      classes: buildClasses({ bet: n, color, type: "number" }),
    }
  }),
  {
    text: "col 1",
    type: "row",
    bet: "row1",
    color: "default",
    classes: buildClasses({ bet: "row1", color: "default", type: "row" }),
  },
  {
    text: "col 2",
    type: "row",
    bet: "row2",
    color: "default",
    classes: buildClasses({ bet: "row2", color: "default", type: "row" }),
  },
  {
    text: "col 3",
    type: "row",
    bet: "row3",
    color: "default",
    classes: buildClasses({ bet: "row3", color: "default", type: "row" }),
  },
  {
    text: "even",
    type: "odd/even",
    bet: "even",
    color: "default",
    classes: buildClasses({ bet: "even", color: "default", type: "odd/even" }),
  },
  {
    text: "odd",
    type: "odd/even",
    bet: "odd",
    color: "default",
    classes: buildClasses({ bet: "odd", color: "default", type: "odd/even" }),
  },
  {
    text: "1-18",
    type: "half",
    bet: "1-18",
    color: "default",
    classes: buildClasses({ bet: "1-18", color: "default", type: "half" }),
  },
  {
    text: "19-36",
    type: "half",
    bet: "19-36",
    color: "default",
    classes: buildClasses({ bet: "19-36", color: "default", type: "half" }),
  },
  {
    text: "red",
    type: "color",
    bet: "red",
    color: "red",
    classes: buildClasses({ bet: "red", color: "red", type: "color" }),
  },
  {
    text: "black",
    type: "color",
    bet: "black",
    color: "black",
    classes: buildClasses({ bet: "black", color: "black", type: "color" }),
  },
  {
    text: "1-12",
    type: "twelve",
    bet: "1-12",
    color: "default",
    classes: buildClasses({ bet: "1-12", color: "default", type: "twelve" }),
  },
  {
    text: "13-24",
    type: "twelve",
    bet: "13-24",
    color: "default",
    classes: buildClasses({ bet: "13-24", color: "default", type: "twelve" }),
  },
  {
    text: "25-36",
    type: "twelve",
    bet: "25-36",
    color: "default",
    classes: buildClasses({ bet: "25-36", color: "default", type: "twelve" }),
  },
]

const ROULETTE_0_VALUES = ROULETTE_00_VALUES.filter(
  (cell) => cell.bet !== 37,
).map((cell) => {
  if (cell.bet === 0) {
    return {
      ...cell,
      classes: cell.classes.replace("roulette0", "roulette0-single"),
    }
  }
  return cell
})

const ROULETTE_0_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
]

const ROULETTE_00_ORDER = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, 37, 27,
  10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2,
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

const CHIP_VALUES = CHIPS.map((chip) => chip.value)

export {
  ROULETTE_0_VALUES,
  ROULETTE_00_VALUES,
  ROULETTE_0_ORDER,
  ROULETTE_00_ORDER,
  CHIPS,
  CHIP_VALUES,
  PIECE_COLORS,
}
