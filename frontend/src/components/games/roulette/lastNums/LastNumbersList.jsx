import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import LastNumber from "./LastNumber"

const LastNumbersList = () => {
    const { winningNums, getRouletteValues } = useRoulette()

    const last4Objects = winningNums
        .slice(0, 5)
        .map((num) => getRouletteValues().find((i) => i.text === String(num)))
        .filter(Boolean)

    if (!last4Objects.length) return null

    return (
        <div className="flex flex-col justify-center items-center gap-2">
            {last4Objects.map((item, index) => (
                <LastNumber key={index} number={item.text} />
            ))}
        </div>
    )
}

export default LastNumbersList
