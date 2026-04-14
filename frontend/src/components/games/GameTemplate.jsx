import React from "react"
import GameScreen from "./GameScreen"

const GameTemplate = ({ game, description, controls }) => {
  return (
    <div className="flex flex-col gap-6 px-2 py-2 md:px-4 md:py-6 sm:px-8 xl:px-10 ">
      <GameScreen game={game} controls={controls} />

      {description}
    </div>
  )
}

export default GameTemplate
