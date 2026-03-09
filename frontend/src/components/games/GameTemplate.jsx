import React from "react"
import GameDescription from "./GameDescription"

const GameTemplate = () => {
    return (
        <div className="flex flex-col gap-6 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-6">
            {/* Área principal del juego */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-[75vh]">
                {/* Sidebar proporcional */}

                <div className="bg-primary flex-4 rounded-md p-4 md:p-6 flex items-center justify-center min-h-[20vh] md:min-h-[60vh]">
                    <span className="text-white text-lg md:text-2xl font-bold">Game Area</span>
                </div>
                <div className="bg-secondary flex-1 md:flex-[2] h-[20vh] md:h-auto rounded-md"></div>
            </div>

            <GameDescription title="Roulette">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum earum quos,
                suscipit sed nobis excepturi distinctio quidem quas ullam blanditiis dolores sit quo
                corporis! Provident possimus a magni id modi? Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Dolorum earum quos, suscipit sed nobis excepturi distinctio quidem
                quas ullam blanditiis dolores sit quo corporis! Provident possimus a magni id modi?
            </GameDescription>
        </div>
    )
}

export default GameTemplate
