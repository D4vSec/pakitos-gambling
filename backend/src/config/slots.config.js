export const SYMBOLS = [
  { name: "cherry", weight: 22, payout: 0.5 },
  { name: "lemon", weight: 20, payout: 0.8 },
  { name: "orange", weight: 17, payout: 1.8 },
  { name: "plum", weight: 14, payout: 5 },
  { name: "bell", weight: 11, payout: 10 },
  { name: "bar", weight: 9, payout: 30 },
  { name: "seven", weight: 7, payout: 100 },
]

export const PATTERN_BOOST = {
  completionChanceByMissingByType: {
    "3x3": {
      1: 25,
    },
    "3x5": {
      1: 90,
      2: 45,
      3: 15,
    },
    "5x5": {
      1: 92,
      2: 50,
      3: 20,
    },
  },
  maxForcedLinesByType: {
    "3x3": 1,
    "3x5": 2,
    "5x5": 3,
  },
}

export const MACHINE_TYPES = {
  "3x3": { rows: 3, cols: 3, minConsecutive: 3 },
  "3x5": { rows: 3, cols: 5, minConsecutive: 5 },
  "5x5": { rows: 5, cols: 5, minConsecutive: 5 },
}

export const generatePaylines = (rows, cols) => {
  const paylines = []
  const addPayline = (id, positions) => {
    paylines.push({ id, positions })
  }

  // ── Horizontal lines (main paylines)
  for (let r = 0; r < rows; r++) {
    addPayline(`H_ROW${r}`, Array.from({ length: cols }, (_, c) => [r, c]))
  }

  // ── Main diagonal (↘) — only for square grids
  if (rows === cols) {
    addPayline("D_MAIN", Array.from({ length: rows }, (_, i) => [i, i]))

    // ── Anti-diagonal (↙)
    addPayline("D_ANTI", Array.from({ length: rows }, (_, i) => [i, cols - 1 - i]))
  }

  // ── V-shape and Λ-shape diagonals (only meaningful on wider grids)
  if (rows >= 3 && cols >= 5) {
    const midRow = Math.floor(rows / 2)
    const midCol = Math.floor(cols / 2)

    const vShape = []
    for (let c = 0; c < cols; c++) {
      const r =
        c <= midCol
          ? Math.round((midRow / midCol) * c)
          : Math.round(midRow - (midRow / midCol) * (c - midCol))
      vShape.push([Math.min(r, rows - 1), c])
    }
    addPayline("D_V", vShape)

    const lambdaShape = vShape.map(([r, c]) => [rows - 1 - r, c])
    addPayline("D_LAMBDA", lambdaShape)
  }

  if (cols === 5 && rows >= 3) {
    const waveDown = [0, 1, 2, 1, 0].map((r, c) => [Math.min(r, rows - 1), c])
    const waveUp = waveDown.map(([r, c]) => [rows - 1 - r, c])
    const sweepDown = [0, 0, 1, 2, 2].map((r, c) => [Math.min(r, rows - 1), c])
    const sweepUp = sweepDown.map(([r, c]) => [rows - 1 - r, c])

    addPayline("Z_WAVE_DOWN", waveDown)
    addPayline("Z_WAVE_UP", waveUp)
    addPayline("Z_SWEEP_DOWN", sweepDown)
    addPayline("Z_SWEEP_UP", sweepUp)
  }

  return paylines
}
