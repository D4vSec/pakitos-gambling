import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { PIECE_COLORS } from "../rouletteConsts"

const ExternalBet = React.memo(
  ({ item, children, highlightedSet, onHover }) => {
    const { t } = useLocale()

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

    const gridClass = `roulette${item.bet}`

    return (
      <button
        className={`${gridClass} ${bgColor} ${hoverClass} text-white font-bold aspect-square md:aspect-auto w-full h-full flex justify-center items-center border border-gray-700 rounded relative transition-colors duration-200 ease-in-out`}
        data-info={JSON.stringify(item)}
        onMouseEnter={() => onHover(item.bet)}
        onMouseLeave={() => onHover("")}>
        {["red", "black", "odd", "even"].includes(item.text)
          ? t(`games.roulette.board.${item.text}`)
          : item.text}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {children}
        </div>
      </button>
    )
  },
)

export default ExternalBet
