import React from "react"
import RouletteTable from "./RouletteTable"
import rouletteImg from "@/assets/roulette0.png"

const Roulette0 = () => {
    return (
        <div className="w-full h-full grid grid-rows-[55%_4 5%] grid-cols-[1fr_2fr_1fr] gap-2">
            <div className="flex justify-center items-center">
                <div className="bg-base-300 w-20 h-20 rounded-lg">last num</div>
            </div>

            <div className="flex justify-center items-center">
                <img src={rouletteImg} alt="Roulette0" className="max-w-9       0"/>
            </div>

            <div className="flex flex-col justify-center items-center gap-2">
                <div className="bg-green-700 w-15 h-15 rounded-lg">last num</div>
                <div className="bg-green-700 w-15 h-15 rounded-lg">last num</div>
                <div className="bg-green-700 w-15 h-15 rounded-lg">last num</div>
                <div className="bg-green-700 w-15 h-15 rounded-lg">last num</div>
            </div>

            <RouletteTable />
        </div>
    )
}

export default Roulette0
