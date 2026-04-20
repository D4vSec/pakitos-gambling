import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import RouletteBoard from "./board/RouletteBoard"
import LastNumbersList from "./lastNums/LastNumbersList"
import Roulette0SVG from "./roulettes/Roulette0SVG"

// TODO: Responsive
const Roulette = () => {
  const { type } = useRoulette()

  return (
    <div className="w-full h-full grid md:grid-rows-[45%_55%] grid-cols-[1fr_1fr] gap-2">
      <div className="hidden md:flex justify-center items-center">
        <Roulette0SVG />
      </div>

      <div className="hidden md:flex flex-col justify-center items-center gap-2">
        <LastNumbersList />
      </div>

      <div className="flex justify-center items-center col-span-3">
        <RouletteBoard type={type} />
      </div>
    </div>
  )
}

export default Roulette
