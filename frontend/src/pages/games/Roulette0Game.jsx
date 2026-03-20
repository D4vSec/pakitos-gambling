import React from "react"
import GameTemplate from "@/components/games/GameTemplate"
import GameDescription from "@/components/games/GameDescription"
import Roulette from "@/components/games/roulette/Roulette"
import RouletteControls from "@/components/games/roulette/controls/RouletteControls"
import RouletteProvider from "@/providers/RouletteProvider"

const Roulette0Game = () => {
    return (
        <RouletteProvider>
            <GameTemplate
                game={<Roulette />}
                description={
                    <GameDescription title="European Roulette">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum earum
                        quos, suscipit sed nobis excepturi distinctio quidem quas ullam blanditiis
                        dolores sit quo corporis! Provident possimus a magni id modi? Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Dolorum earum quos, suscipit
                        sed nobis excepturi distinctio quidem quas ullam blanditiis dolores sit quo
                        corporis! Provident possimus a magni id modi?
                    </GameDescription>
                }
                controls={<RouletteControls />}
            />
        </RouletteProvider>
    )
}

export default Roulette0Game
