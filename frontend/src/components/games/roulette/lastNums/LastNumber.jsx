import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"

const LastNumber = ({ number }) => {
    const { getRouletteValues, type } = useRoulette()

    if (!number) return null

    // Buscar el objeto completo que corresponde al número
    const item = getRouletteValues(type).find((i) => i.text === String(number))

    if (!item) return null

    const getBgColor = (color) => {
        switch (color) {
            case "red":
                return "bg-red-500"
            case "black":
                return "bg-black"
            case "green":
                return "bg-green-600"
            default:
                return "bg-gray-300"
        }
    }

    return (
        <div
            className={`${getBgColor(item.color)} border-2 border-gray-700 w-12 h-12 sm:w-15 sm:h-15 rounded-lg flex justify-center items-center text-white font-bold`}
        >
            {item.text}
        </div>
    )
}

export default LastNumber
