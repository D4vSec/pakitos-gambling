import React, { useLayoutEffect, useRef, useState } from "react"
import SlotReel from "./SlotReel"
import { PAYLINE_POSITIONS, getStopDelays } from "./slotConstants"

const MAX_REEL_SIZE = 171
const MIN_REEL_SIZE = 1
const GRID_CHROME_SIZE = 16

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
  className = "",
  style,
  grid,
  winningLines = [],
  rows = 3,
  cols = 3,
  machineType = "3x3",
  theme = "starwars",
  paylines,
  isSpinning = false,
  onSizeChange,
}) => {
  const containerRef = useRef(null)
  const [reelSize, setReelSize] = useState(MAX_REEL_SIZE)
  const winningCells = getWinningCells(winningLines, machineType, paylines)

  useLayoutEffect(() => {
    const parent = containerRef.current?.parentElement
    if (!parent) return undefined

    const updateReelSize = () => {
      const { width, height } = parent.getBoundingClientRect()
      const fitByWidth = (width - GRID_CHROME_SIZE) / cols
      const fitByHeight = (height - GRID_CHROME_SIZE) / rows
      const nextSize = Math.floor(
        Math.min(MAX_REEL_SIZE, fitByWidth, fitByHeight),
      )

      setReelSize(Math.max(MIN_REEL_SIZE, nextSize))
    }

    updateReelSize()
    const observer = new ResizeObserver(updateReelSize)
    observer.observe(parent)

    return () => observer.disconnect()
  }, [cols, rows])

  const gridWidth = reelSize * cols + GRID_CHROME_SIZE
  const gridHeight = reelSize * rows + GRID_CHROME_SIZE

  useLayoutEffect(() => {
    onSizeChange?.({ width: gridWidth, height: gridHeight })
  }, [gridHeight, gridWidth, onSizeChange])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{
        width: `${gridWidth}px`,
        height: `${gridHeight}px`,
        maxWidth: "100%",
        maxHeight: "100%",
        ...style,
      }}>
      <div className="h-full w-full rounded-xl bg-linear-to-br from-accent/80 via-warning to-accent/80 p-1.5 shadow-[0_0_14px] shadow-accent/30">
        <div
          className={`
            relative grid h-full w-full overflow-hidden rounded-lg border-2 bg-neutral-950
            transition-all duration-500
            border-amber-600/40 shadow-inner
          `}
          style={{ gridTemplateColumns: `repeat(${cols}, ${reelSize}px)` }}>
          {Array.from({ length: cols }, (_, c) => (
            <SlotReel
              key={`${theme}-${machineType}-${rows}-${cols}-${reelSize}-${c}`}
              colIndex={c}
              rows={rows}
              reelSize={reelSize}
              theme={theme}
              symbols={Array.from(
                { length: rows },
                (_, r) => grid?.[r]?.[c] ?? null,
              )}
              isSpinning={isSpinning}
              stopDelay={getStopDelays(cols)[c] ?? c * 350}
              winningCells={winningCells}
            />
          ))}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-linear-to-b from-neutral-950/90 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-linear-to-t from-neutral-950/90 to-transparent" />
        </div>
      </div>
    </div>
  )
}

export default SlotGrid
