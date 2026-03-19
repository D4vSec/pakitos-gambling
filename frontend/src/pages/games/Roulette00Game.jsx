import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import Roulette from "@/components/games/roulette/Roulette"
import React from "react"
import RouletteController from "@/components/games/roulette/controller/RouletteController"
import RouletteProvider from "@/providers/RouletteProvider"

const Roulette00Game = () => {
    return (
        <RouletteProvider>
            <GameTemplate
                game={<Roulette />}
                description={
                    <GameDescription title="American Roulette">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum earum
                        quos, suscipit sed nobis excepturi distinctio quidem quas ullam blanditiis
                        dolores sit quo corporis! Provident possimus a magni id modi? Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Dolorum earum quos, suscipit
                        sed nobis excepturi distinctio quidem quas ullam blanditiis dolores sit quo
                        corporis! Provident possimus a magni id modi?
                    </GameDescription>
                }
                controls={<RouletteController />}
            />
        </RouletteProvider>
    )
}

export default Roulette00Game
