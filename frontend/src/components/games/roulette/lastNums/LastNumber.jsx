import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"

const LastNumber = ({ number }) => {
  const { getRouletteValues } = useRoulette()

  number === 37 && (number = "00")
  const item = getRouletteValues().find((i) => i.text === String(number)) || {}

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
      className={`${getBgColor(item.color)} border-2 border-gray-700 w-12 h-12 md:w-13 md:h-13 lg:w-15 lg:h-15 rounded-lg flex justify-center items-center text-white font-bold`}>
      {item.text}
    </div>
  )
}

export default LastNumber
