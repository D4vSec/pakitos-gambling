import React from "react"
import SlotReel from "./SlotReel"

const PAYLINE_POSITIONS = {
  "3x3": {
    H_ROW0: [[0,0],[0,1],[0,2]],
    H_ROW1: [[1,0],[1,1],[1,2]],
    H_ROW2: [[2,0],[2,1],[2,2]],
    D_MAIN: [[0,0],[1,1],[2,2]],
    D_ANTI: [[0,2],[1,1],[2,0]],
  },
}

const getWinningCells = (winningLines, machineType, paylines) => {
  const winSet = new Set()
  if (!winningLines?.length) return winSet

  const posMap = PAYLINE_POSITIONS[machineType] ?? {}

  for (const line of winningLines) {
    let positions = null

    if (paylines?.length) {
      const found = paylines.find((p) => p.id === line.paylineId)
      if (found) positions = found.positions
    }

    if (!positions) positions = posMap[line.paylineId] ?? []

    for (const [r, c] of positions) {
      winSet.add(`${r},${c}`)
    }
  }

  return winSet
}

// STOP_DELAYS: each column stops this many ms after isSpinning→false.
// Left-to-right stagger gives the classic slot machine feel.
const STOP_DELAYS = [0, 350, 700]

const SlotGrid = ({
  grid,
  winningLines = [],
  rows = 3,
  cols = 3,
  machineType = "3x3",
  paylines,
  isSpinning = false,
}) => {
  const winningCells = getWinningCells(winningLines, machineType, paylines)

  return (
    // Outer wrapper: dark background + gold border — the "window" of the machine
    <div className="relative flex rounded-xl overflow-hidden border-2 border-amber-500/50 bg-neutral-900 p-2 gap-0">
      {/* Vertical dividers between reels */}
      {Array.from({ length: cols }, (_, c) => (
        <React.Fragment key={c}>
          {c > 0 && (
            <div className="w-px self-stretch bg-amber-700/40 shrink-0" />
          )}
          <SlotReel
            colIndex={c}
            rows={rows}
            symbols={Array.from({ length: rows }, (_, r) => grid?.[r]?.[c] ?? null)}
            isSpinning={isSpinning}
            stopDelay={STOP_DELAYS[c] ?? c * 350}
            winningCells={winningCells}
          />
        </React.Fragment>
      ))}

      {/* Top + bottom gradient to suggest the tape extends beyond the window */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-linear-to-b from-neutral-900/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-linear-to-t from-neutral-900/80 to-transparent z-10" />
    </div>
  )
}

export default SlotGrid
