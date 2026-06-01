import React from "react"
import GameScreen from "./GameScreen"

const GameTemplate = ({ game, description, controls }) => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 p-1.5 md:gap-3 md:p-2 lg:gap-6 lg:px-4 lg:py-6 xl:px-10">
      <GameScreen game={game} controls={controls} />
      <div className="w-full shrink-0">{description}</div>
    </div>
  )
}

export default GameTemplate
