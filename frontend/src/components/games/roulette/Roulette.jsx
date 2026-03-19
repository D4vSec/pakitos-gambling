import React from "react"
import RouletteTable from "./table/RouletteTable"
import rouletteImg from "@/assets/roulette0.png"
import { useRoulette } from "@/providers/RouletteProvider"
import LastNumber from "./lastNums/LastNumber"
import LastNumbersList from "./lastNums/LastNumbersList"

const Roulette = () => {
    const { type, winningNums } = useRoulette()

    return (
        <div className="w-full h-full grid grid-rows-[30%_70%] md:grid-rows-[55%_45%] grid-cols-[1fr_2fr_1fr] gap-2">
            <div className="flex justify-center items-center">
                <LastNumber number={winningNums[0]} />
            </div>

            <div className="flex justify-center items-center">
                <img
                    src={rouletteImg}
                    alt="Roulette0"
                    className="xs:max-w-30 sm:max-w-64 md:max-w-70 lg:max-w-84"
                />
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
                <LastNumbersList />
            </div>

            <div className="flex justify-center items-center col-span-3">
                <RouletteTable type={type} />
            </div>
        </div>
    )
}

export default Roulette
