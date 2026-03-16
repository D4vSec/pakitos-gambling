import React from "react"
import GameDescription from "./GameDescription"
import GameScreen from "./GameScreen"

const GameTemplate = ({ game, description, controls }) => {
    return (
        <div className="flex flex-col gap-6 px-4 sm:px-8 xl:px-10 py-6">
            <GameScreen game={game} controls={controls} />

            {description}
        </div>
    )
}

export default GameTemplate
