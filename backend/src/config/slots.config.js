export const SYMBOLS = [
  { name: "cherry", weight: 28, payout: 0.5 },
  { name: "lemon", weight: 22, payout: 0.8 },
  { name: "orange", weight: 18, payout: 1.8 },
  { name: "plum", weight: 12, payout: 5 },
  { name: "bell", weight: 8, payout: 10 },
  { name: "bar", weight: 6, payout: 30 },
  { name: "seven", weight: 4, payout: 100 },
]

export const MACHINE_TYPES = {
  "3x3": { rows: 3, cols: 3, minConsecutive: 3 },
  "3x5": { rows: 3, cols: 5, minConsecutive: 5 },
  "5x5": { rows: 5, cols: 5, minConsecutive: 5 },
}

export const generatePaylines = (rows, cols) => {
  const paylines = []

  // ── Horizontal lines (main paylines)
  for (let r = 0; r < rows; r++) {
    paylines.push({
      id: `H_ROW${r}`,
      positions: Array.from({ length: cols }, (_, c) => [r, c]),
    })
  }

  // ── Main diagonal (↘) — only for square grids
  if (rows === cols) {
    paylines.push({
      id: "D_MAIN",
      positions: Array.from({ length: rows }, (_, i) => [i, i]),
    })

    // ── Anti-diagonal (↙)
    paylines.push({
      id: "D_ANTI",
      positions: Array.from({ length: rows }, (_, i) => [i, cols - 1 - i]),
    })
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
    paylines.push({ id: "D_V", positions: vShape })

    const lambdaShape = vShape.map(([r, c]) => [rows - 1 - r, c])
    paylines.push({ id: "D_LAMBDA", positions: lambdaShape })
  }

  return paylines
}
