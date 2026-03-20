import React from "react"
import BlackjackBoard from "@/components/games/blackjack/board/BlackjackBoard"
import BlackjackControls from "@/components/games/blackjack/controls/BlackjackControls"
import GameDescription from "@/components/games/GameDescription"
import GameTemplate from "@/components/games/GameTemplate"

import BlackjackProvider from "@/providers/BlackjackProvider"

const BlackjackGame = () => {
    return (
        <BlackjackProvider>
            <GameTemplate
                game={<BlackjackBoard />}
                description={
                    <GameDescription title="Blackjack">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum earum
                        quos, suscipit sed nobis excepturi distinctio quidem quas ullam blanditiis
                        dolores sit quo corporis! Provident possimus a magni id modi? Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Dolorum earum quos, suscipit
                        sed nobis excepturi distinctio quidem quas ullam blanditiis dolores sit quo
                        corporis! Provident possimus a magni id modi?
                    </GameDescription>
                }
                controls={<BlackjackControls />}
            />
        </BlackjackProvider>
    )
}

export default BlackjackGame
