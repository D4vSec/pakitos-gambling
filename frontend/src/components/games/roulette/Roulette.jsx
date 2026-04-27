import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import RouletteBoard from "./board/RouletteBoard"
import LastNumbersList from "./lastNums/LastNumbersList"
import RouletteWheel from "./roulettes/RouletteWheel"

const Roulette = () => {
  const { type } = useRoulette()

  return (
    <div className="w-full h-full grid grid-rows-[45%_55%] md:grid-cols-2 gap-2">
      <div className="hidden md:flex items-center justify-center">
        <RouletteWheel type={type} />
      </div>

      <div className="hidden md:flex flex-col justify-center items-center gap-2">
        <LastNumbersList />
      </div>

      <div className="col-span-2 flex justify-center items-center">
        <RouletteBoard type={type} />
      </div>
    </div>
  )
}

export default Roulette
