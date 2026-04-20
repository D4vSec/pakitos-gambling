import React from "react"
import GameNotifications from "../notification/GameNotifications"

const GameScreen = ({ game, controls }) => {
  return (
    <div
      className="
        grid
        grid-rows-[70%_30%]
        lg:grid-rows-1
        lg:grid-cols-[75%_25%]
        gap-4 md:gap-6
        min-h-[75vh]
      ">
      {/* GAME */}
      <div className="relative bg-base-100 p-4 rounded-md flex items-center justify-center min-h-[20vh] lg:min-h-[60vh]">
        <GameNotifications />
        {game}
      </div>

      {/* CONTROLS */}
      <div className="bg-base-100 rounded-md h-full">{controls}</div>
    </div>
  )
}

export default GameScreen
