import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import rouletteImg from "@/assets/roulette0.png"
import RouletteBoard from "./board/RouletteBoard"
import LastNumbersList from "./lastNums/LastNumbersList"

const Roulette = () => {
    const { type } = useRoulette()

    return (
        <div className="w-full h-full grid grid-rows-[25%_75%] md:grid-rows-[50%_50%] grid-cols-[1fr_1fr] gap-2">
            <div className="flex justify-center items-center">
                <img
                    src={rouletteImg}
                    alt="Roulette0"
                    className="xs:max-w-30 sm:max-w-42 md:max-w-58 lg:max-w-66 xl:max-w-74"
                />
            </div>

            <div className="hidden sm:flex flex-col justify-center items-center gap-2">
                <LastNumbersList />
            </div>

            <div className="flex justify-center items-center col-span-3">
                <RouletteBoard type={type} />
            </div>
        </div>
    )
}

export default Roulette
