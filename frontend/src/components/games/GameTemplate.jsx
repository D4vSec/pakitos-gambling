import React from "react"
import GameScreen from "./GameScreen"

const GameTemplate = ({ game, description, controls }) => {
  return (
    <div className="grid grid-rows-1 lg:grid-rows-[minmax(0,1fr)_auto] h-full min-h-0 w-full min-w-0 gap-2 md:gap-3 lg:gap-6 p-1.5 md:p-2 lg:py-6 lg:px-4 xl:px-10">
      <GameScreen game={game} controls={controls} />
      <div>{description}</div>
    </div>
  )
}

export default GameTemplate
