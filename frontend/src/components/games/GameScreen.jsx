import React from "react"

const GameScreen = ({ game, controls }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 min-h-[75vh]">
            <div className="bg-base-100 flex-4 md:flex-5 rounded-md p-4 md:p-6 flex items-center justify-center min-h-[20vh] md:min-h-[60vh]">
                {game}
            </div>
            <div className="bg-base-100 flex-1 md:flex-2 h-[20vh] md:h-auto rounded-md">
                {controls}
            </div>
        </div>
    )
}

export default GameScreen
