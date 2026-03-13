import React from "react"
import GameDescription from "./GameDescription"

const GameTemplate = ({ game, description }) => {
    return (
        <div className="flex flex-col gap-6 px-4 sm:px-8 md:px-16 lg:px-24 py-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-[75vh]">
                <div className="bg-base-100 flex-4 md:flex-5 rounded-md p-4 md:p-6 flex items-center justify-center min-h-[20vh] md:min-h-[60vh]">
                    {game}
                </div>
                <div className="bg-base-100 flex-1 md:flex-2 h-[20vh] md:h-auto rounded-md"></div>
            </div>

            {description}
        </div>
    )
}

export default GameTemplate
