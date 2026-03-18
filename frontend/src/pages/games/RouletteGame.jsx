import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import Roulette0 from "@/components/games/roulette/Roulette0"
import React from "react"
import RouletteController from "@/components/games/roulette/controller/RouletteController"

const RouletteGame = () => {
    return (
        <GameTemplate
            game={<Roulette0 />}
            description={
                <GameDescription title="Roulette">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum earum quos,
                    suscipit sed nobis excepturi distinctio quidem quas ullam blanditiis dolores sit
                    quo corporis! Provident possimus a magni id modi? Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Dolorum earum quos, suscipit sed nobis excepturi
                    distinctio quidem quas ullam blanditiis dolores sit quo corporis! Provident
                    possimus a magni id modi?
                </GameDescription>
            }
            controls={<RouletteController />}
        />
    )
}

export default RouletteGame
