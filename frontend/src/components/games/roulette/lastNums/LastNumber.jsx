import React from "react"
import { useRoulette } from "@/providers/rouletteContext"

const LastNumber = ({ number }) => {
  const { rouletteValues } = useRoulette()
  const isPlaceholder = number === true

  const normalizedNumber = (() => {
    if (number === "00" || number === 37 || number === "37") return "00"
    if (number === null || number === undefined) return ""
    return String(number)
  })()

  const item = rouletteValues.find((i) => i.text === normalizedNumber) || {}

  const getBgColor = (color) => {
    switch (color) {
      case "red":
        return "bg-red-500"
      case "black":
        return "bg-black"
      case "green":
        return "bg-green-600"
      default:
        return "bg-zinc-800"
    }
  }

  return (
    <div
      className={`${getBgColor(item.color)} flex items-center justify-center rounded-lg border-2 border-gray-700 text-white font-bold ${
        isPlaceholder
          ? "h-10 w-10 sm:h-12 sm:w-12 md:h-15 md:w-15"
          : "h-15 w-15"
      }`}>
      {item.text}
    </div>
  )
}

export default LastNumber
