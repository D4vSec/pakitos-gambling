import React from "react"

import { useSession } from "@/providers/SessionProvider"
import useAPI from "@/hooks/useAPI"
import { useNotification } from "@/providers/NotificationProvider"

import BlackjackBoard from "@/components/games/blackjack/BlackjackBoard"
import BlackjackControls from "@/components/games/blackjack/controller/BlackjackControls"
import GameDescription from "@/components/games/GameDescription"
import GameTemplate from "@/components/games/GameTemplate"

import { useEffect, useState } from "react"

const BlackjackGame = () => {
    const [game, setGame] = useState({})
    const { getRefreshToken } = useSession()
    const { addNotification } = useNotification()
    const { get, post } = useAPI()

    const startGame = async () => {
        const url = "http://localhost:3000/v1/blackjack/start"
        try {
            const res = await post(url, {
                body: JSON.stringify({ "x-refresh-token": getRefreshToken() }),
            })

            console.log(res)
        } catch (error) {
            addNotification(error.message, "error")
        }
    }
    useEffect(() => {
        startGame()
    }, [])

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
            controls={<BlackjackControls />}
        />
    )
}

export default BlackjackGame
