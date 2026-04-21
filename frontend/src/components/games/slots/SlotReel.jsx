import React, { useEffect, useRef, useState } from "react"
import SlotCell from "./SlotCell"

const POOL = ["cherry", "lemon", "orange", "plum", "bell", "bar", "seven"]
const rand = () => POOL[Math.floor(Math.random() * POOL.length)]

// stopDelay: ms after isSpinning→false before this reel locks on final symbols.
// Stagger the delay per column to get the left-to-right stop effect.
const SlotReel = ({
  symbols = [],
  rows = 3,
  colIndex = 0,
  isSpinning,
  stopDelay = 0,
  winningCells,
}) => {
  const [display, setDisplay] = useState(() => Array(rows).fill(null))
  // animCounter drives the `key` on each cell's inner span.
  // Changing the key forces React to remount the span → CSS animation retriggers.
  const [animCounter, setAnimCounter] = useState(0)
  const [isLanding, setIsLanding] = useState(false)

  // Track whether a spin has ever been initiated so we don't run stop-logic on mount.
  const hasSpunRef = useRef(false)
  // Keep the current interval/timeout ids so we can cancel on re-render.
  const intervalRef = useRef(null)
  const stopRef = useRef(null)
  const landRef = useRef(null)

  const clearTimers = () => {
    clearInterval(intervalRef.current)
    clearTimeout(stopRef.current)
    clearTimeout(landRef.current)
  }

  useEffect(() => {
    clearTimers()

    if (isSpinning) {
      hasSpunRef.current = true
      setIsLanding(false)

      // Fast cycle — symbols scroll past quickly
      intervalRef.current = setInterval(() => {
        setDisplay(Array.from({ length: rows }, rand))
        setAnimCounter((c) => c + 1)
      }, 100)
    } else if (hasSpunRef.current) {
      // Decelerate: slightly slower cycle while we wait for the stop signal
      intervalRef.current = setInterval(() => {
        setDisplay(Array.from({ length: rows }, rand))
        setAnimCounter((c) => c + 1)
      }, 175)

      // After stopDelay, lock onto the real result
      stopRef.current = setTimeout(() => {
        clearInterval(intervalRef.current)
        setDisplay(symbols.length === rows ? [...symbols] : Array(rows).fill(null))
        // Bump counter so the landing animation fires on the new symbols
        setAnimCounter((c) => c + 1)
        setIsLanding(true)
        // Remove landing class after animation completes (≈500 ms)
        landRef.current = setTimeout(() => setIsLanding(false), 550)
      }, stopDelay)
    }

    return clearTimers
  }, [isSpinning]) // eslint-disable-line react-hooks/exhaustive-deps

  // If symbols change while the reel is idle (e.g. session recovered from localStorage),
  // show them directly without animation.
  useEffect(() => {
    if (!hasSpunRef.current) {
      setDisplay(symbols.length === rows ? [...symbols] : Array(rows).fill(null))
    }
  }, [symbols]) // eslint-disable-line react-hooks/exhaustive-deps

  const isMoving = isSpinning || (hasSpunRef.current && isLanding === false && intervalRef.current)

  return (
    <div className="flex flex-col gap-1.5 flex-1 px-1.5">
      {display.map((symbol, rowIndex) => (
        <SlotCell
          key={`${colIndex}-${rowIndex}`}
          symbol={symbol}
          animKey={`${colIndex}-${rowIndex}-${animCounter}`}
          isWinning={!isMoving && !isLanding && winningCells?.has(`${rowIndex},${colIndex}`)}
          isLanding={isLanding}
        />
      ))}
    </div>
  )
}

export default SlotReel
