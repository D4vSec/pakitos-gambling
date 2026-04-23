import React from "react"

const SYMBOL_DISPLAY = {
  cherry: "🍒",
  lemon: "🍋",
  orange: "🍊",
  plum: "🍇",
  bell: "🔔",
  bar: "BAR",
  seven: "7",
}

// The container has overflow-hidden so the incoming symbol is clipped
// until it slides into view from the top, creating the classic reel effect.
const SlotCell = ({ symbol, isWinning = false, animKey, isLanding = false }) => {
  return (
    <div
      className={`
        relative w-full aspect-square overflow-hidden rounded-lg border-2 select-none
        transition-colors duration-300
        ${isWinning
          ? "border-warning bg-warning/15 shadow-lg shadow-warning/40"
          : "border-neutral-700 bg-neutral-800"
        }
      `}
    >
      {symbol ? (
        <span
          key={animKey}
          className={`absolute inset-0 flex items-center justify-center text-4xl font-bold
            ${isLanding ? "slot-land" : "slot-spin-drop"}
          `}
        >
          {SYMBOL_DISPLAY[symbol] ?? symbol}
        </span>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-xl opacity-20 text-neutral-400">
          ?
        </span>
      )}
    </div>
  )
}

export default SlotCell
