import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import RouletteBoard from "./board/RouletteBoard"
import LastNumbersList from "./lastNums/LastNumbersList"
import RouletteWheel from "./roulettes/RouletteWheel"

const Roulette = () => {
  const { type, showSpinView } = useRoulette()

  return (
    <div className="relative h-full w-full overflow-hidden sm:grid sm:grid-cols-2 sm:grid-rows-[45%_55%] sm:gap-3 md:gap-4">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out sm:flex sm:opacity-100 sm:scale-100 sm:pointer-events-auto sm:static ${
          showSpinView
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}>
        <RouletteWheel type={type} />
      </div>

      <div className="hidden sm:flex flex-col justify-center items-center gap-2">
        <LastNumbersList />
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-all duration-500 ease-out sm:static sm:col-span-2 sm:opacity-100 sm:scale-100 sm:pointer-events-auto ${
          showSpinView
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100"
        }`}>
        <div className="flex h-full w-full items-center justify-center gap-8 sm:gap-16 px-2 sm:contents">
          <div className="flex h-full shrink-0 flex-col items-center justify-center xs-only-lastnums">
            <LastNumbersList compact vertical />
          </div>
          <RouletteBoard type={type} />
        </div>
      </div>
    </div>
  )
}

export default Roulette
