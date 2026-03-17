import React, { createContext, useContext, useEffect, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useSession } from "./SessionProvider"

const BlackjackContext = createContext()

const GAME_ID_KEY = "blackjackGameId"

const getGameId = () => localStorage.getItem(GAME_ID_KEY)
const setGameId = (id) => localStorage.setItem(GAME_ID_KEY, id)
const removeGameId = () => localStorage.removeItem(GAME_ID_KEY)

const BlackjackProvider = ({ children }) => {
    const [game, setGame] = useState({})
    const [thinking, setThinking] = useState(false)
    const { getRefreshToken, getAccessToken } = useSession()
    const { addNotification } = useNotification()
    const { post } = useAPI()

    const startGame = async () => {
        setThinking(true)
        const url = "http://localhost:3000/v1/blackjack/start"

        try {
            const res = await post(url, {
                headers: {
                    "x-refresh-token": getRefreshToken(),
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: {
                    amount: 1,
                },
            })

            if (res.code) {
                throw new Error(res.code)
            }

            if (res.gameId) {
                setGameId(res.gameId)
            }

            console.log(res)
            setGame(res)
        } catch (error) {
            addNotification(error.message, "error")
        } finally {
            setThinking(false)
        }
    }

    useEffect(() => {
        if (!getGameId()) {
            startGame()
        }

        return () => {
            removeGameId()
        }
    }, [])

    const value = {
        game,
    }

    return <BlackjackContext value={value}>{children}</BlackjackContext>
}

export default BlackjackProvider

export const useBlackjack = () => {
    const context = useContext(BlackjackContext)

    if (!context) {
        throw new Error("Provider outside scope")
    }

    return context
}
