import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import { PIECE_COLORS } from "../rouletteConsts"

const NumberBet = React.memo(({ item, children, highlightedSet }) => {
  const { type } = useRoulette()

  if (!item) return null

  let bgClass = PIECE_COLORS.default.base
  let highlightClass = PIECE_COLORS.default.hover
  const hoverClass = PIECE_COLORS[item.color]?.hoverClass || ""

  if (item.color && PIECE_COLORS[item.color]) {
    bgClass = PIECE_COLORS[item.color].base
    highlightClass = PIECE_COLORS[item.color].hover
  }

  const isHighlighted = highlightedSet.has(item.bet)
  const bgColor = isHighlighted ? highlightClass : bgClass

  let gridClass = `roulette${item.bet}`

  if (type === "Zero" && item.text === "0") {
    gridClass = "roulette0-single"
  }

  return (
    <button
      className={`${gridClass} ${bgColor} ${hoverClass} text-white font-bold flex justify-center items-center border border-gray-700 rounded relative transition-colors duration-200 ease-in-out`}
      data-info={JSON.stringify(item)}>
      {item.text}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </button>
  )
})

export default NumberBet
