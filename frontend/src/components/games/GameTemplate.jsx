import React from "react"
import GameScreen from "./GameScreen"

const GameTemplate = ({ game, description, controls }) => {
  return (
    <div
      className="
        grid
        grid-rows-[1fr_auto]
        w-full min-w-0
        gap-6
        px-2 py-2
        md:px-4 md:py-6
        sm:px-8 xl:px-10
      ">
      <GameScreen game={game} controls={controls} />

      {description}
    </div>
  )
}

export default GameTemplate
