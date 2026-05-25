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
  theme = "starwars",
  paylines,
  isSpinning = false,
  hasWon = false,
  onAllSettled,
}) => {
  const winningCells = getWinningCells(winningLines, machineType, paylines)

  return (
    <div
      className={`
        relative flex rounded-xl overflow-hidden border-2 bg-neutral-950 p-2 gap-0
        transition-all duration-500
        ${hasWon
          ? "border-warning shadow-[0_0_24px_4px] shadow-warning/40"
          : "border-amber-600/40 shadow-inner"
        }
      `}
    >
      {/* Vertical dividers between reels */}
      {Array.from({ length: cols }, (_, c) => (
        <React.Fragment key={c}>
          {c > 0 && (
            <div className="w-px self-stretch bg-amber-800/30 shrink-0" />
          )}
          <SlotReel
            colIndex={c}
            rows={rows}
            machineType={machineType}
            theme={theme}
            symbols={Array.from({ length: rows }, (_, r) => grid?.[r]?.[c] ?? null)}
            isSpinning={isSpinning}
            stopDelay={getStopDelays(cols)[c] ?? c * 350}
            winningCells={winningCells}
            onSettled={c === cols - 1 ? onAllSettled : undefined}
          />
        </React.Fragment>
      ))}

      {/* Gradient vignette — suggests the tape continues beyond the window */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-linear-to-b from-neutral-950/90 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-neutral-950/90 to-transparent z-10" />
    </div>
  )
}

export default SlotGrid
