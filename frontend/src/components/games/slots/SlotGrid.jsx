import React from "react"
import SlotReel from "./SlotReel"
import { PAYLINE_POSITIONS, getStopDelays } from "./slotConstants"

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
            stopDelay={getStopDelays(cols)[c] ?? c * 350}
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
