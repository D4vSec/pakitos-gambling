import React, { useEffect, useRef, useState } from "react"
import SlotCell from "./SlotCell"

const POOL = ["cherry", "lemon", "orange", "plum", "bell", "bar", "seven"]
const rand = () => POOL[Math.floor(Math.random() * POOL.length)]

// Phases: "idle" → "spinning" → "decelerating" → "landing" → "stopped"
// Using explicit phase state avoids the ref-truthy bug where intervalRef.current
// stays non-null after clearInterval(), causing isWinning to never activate.
const SlotReel = ({
  symbols = [],
  rows = 3,
  colIndex = 0,
  isSpinning,
  stopDelay = 0,
  winningCells,
}) => {
  const [display, setDisplay] = useState(() => Array(rows).fill(null))
  const [animCounter, setAnimCounter] = useState(0)
  const [phase, setPhase] = useState("idle")

  const hasSpunRef = useRef(false)
  const intervalRef = useRef(null)
  const stopRef = useRef(null)
  const landRef = useRef(null)

  const clearTimers = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    clearTimeout(stopRef.current)
    stopRef.current = null
    clearTimeout(landRef.current)
    landRef.current = null
  }

  useEffect(() => {
    clearTimers()

    if (isSpinning) {
      hasSpunRef.current = true
      setPhase("spinning")
      intervalRef.current = setInterval(() => {
        setDisplay(Array.from({ length: rows }, rand))
        setAnimCounter((c) => c + 1)
      }, 100)
    } else if (hasSpunRef.current) {
      setPhase("decelerating")
      intervalRef.current = setInterval(() => {
        setDisplay(Array.from({ length: rows }, rand))
        setAnimCounter((c) => c + 1)
      }, 175)

      stopRef.current = setTimeout(() => {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setDisplay(symbols.length === rows ? [...symbols] : Array(rows).fill(null))
        setAnimCounter((c) => c + 1)
        setPhase("landing")
        landRef.current = setTimeout(() => setPhase("stopped"), 550)
      }, stopDelay)
    }

    return clearTimers
  }, [isSpinning]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync display when symbols arrive while reel is still idle (recovery from localStorage)
  useEffect(() => {
    if (phase === "idle") {
      setDisplay(symbols.length === rows ? [...symbols] : Array(rows).fill(null))
    }
  }, [symbols]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-1.5 flex-1 px-1.5">
      {display.map((symbol, rowIndex) => (
        <SlotCell
          key={`${colIndex}-${rowIndex}`}
          symbol={symbol}
          animKey={`${colIndex}-${rowIndex}-${animCounter}`}
          isWinning={phase === "stopped" && !!winningCells?.has(`${rowIndex},${colIndex}`)}
          isLanding={phase === "landing"}
        />
      ))}
    </div>
  )
}

export default SlotReel
