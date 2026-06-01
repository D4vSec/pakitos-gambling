import React from "react"
import { useRoulette } from "@/providers/rouletteContext"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "@/components/buttons/Button"

const BoardPiece = ({ item, cellId, children }) => {
  const { type } = useRoulette()
  const { t } = useLocale()

  if (!item) return null

  let bgColor = "bg-zinc-800"
  let textColor = "text-white"
  if (item.color === "red") bgColor = "bg-red-500"
  else if (item.color === "black") {
    bgColor = "bg-black"
  } else if (item.color === "green") {
    bgColor = "bg-green-600"
  }

  let gridClass = `roulette${item.bet}`

  if (type === "Zero" && item.text === "0") {
    gridClass = "roulette0-single"
  }

  return (
    <Button
      type="button"
      unstyled
      className={`${gridClass} ${bgColor} ${textColor} font-bold flex justify-center items-center border border-gray-700 rounded relative`}
      data-cell-id={cellId}>
      {["red", "black", "odd", "even"].includes(item.text)
        ? t(`games.roulette.board.${item.text}`)
        : item.text}

      {/* Chips */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {children}
      </div>
    </Button>
  )
}

export default BoardPiece
