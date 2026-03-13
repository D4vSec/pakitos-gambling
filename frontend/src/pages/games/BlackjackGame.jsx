import BlackjackBoard from "@/components/games/blackjack/BlackjackBoard"
import GameDescription from "@/components/games/GameDescription"
import GameTemplate from "@/components/games/GameTemplate"
import React from "react"

const BlackjackGame = () => {
    return (
        <GameTemplate
            game={<BlackjackBoard />}
            description={
                <GameDescription title="Blackjack">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum earum quos,
                    suscipit sed nobis excepturi distinctio quidem quas ullam blanditiis dolores sit
                    quo corporis! Provident possimus a magni id modi? Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Dolorum earum quos, suscipit sed nobis excepturi
                    distinctio quidem quas ullam blanditiis dolores sit quo corporis! Provident
                    possimus a magni id modi?
                </GameDescription>
            }
        />
    )
}

export default BlackjackGame
