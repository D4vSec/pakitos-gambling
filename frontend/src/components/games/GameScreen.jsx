import React from "react"
import GameNotifications from "../notification/GameNotifications"

const GameScreen = ({ game, controls }) => {
  return (
    <div
      className="
        grid
        gap-4 md:gap-6
        grid-rows-auto
        lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]
        h-full
        w-full
        min-h-0
      ">
      {/* GAME */}
      <div className="relative bg-base-100 rounded-md border-16 border-base-100 flex items-center justify-center overflow-hidden min-h-0">
        {/* 👇 ESTO NO SE TOCA */}
        <GameNotifications />

        {game}
      </div>

      {/* CONTROLS */}
      <div className="bg-base-100 rounded-md min-h-0">{controls}</div>
    </div>
  )
}

export default GameScreen
