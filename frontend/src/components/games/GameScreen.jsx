import React from "react"
import GameNotifications from "../notification/GameNotifications"

const GameScreen = ({ game, controls }) => {
  return (
    <div className="grid h-full w-full min-h-0 gap-3 md:gap-4 lg:gap-6 grid-rows-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,3fr)_minmax(18rem,1fr)] lg:grid-rows-1 overflow-hidden">
      <div className="relative bg-base-100 rounded-md border-8 md:border-12 lg:border-16 border-base-100 flex items-center justify-center overflow-hidden min-h-0">
        <GameNotifications />
        {game}
      </div>
      <div className="bg-base-100 rounded-md min-h-0 md:overflow-visible lg:overflow-y-auto">
        {controls}
      </div>
    </div>
  )
}

export default GameScreen
