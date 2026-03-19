import React, { createContext, useContext, useEffect, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useSession } from "./SessionProvider"
import { useLocale } from "./LocaleProvider"

const BlackjackContext = createContext()

const GAME_ID_KEY = "blackjackGameId"
const HOST = "localhost:3000"

const getGameId = () => localStorage.getItem(GAME_ID_KEY)
const setGameId = (id) => localStorage.setItem(GAME_ID_KEY, id)
const removeGameId = () => localStorage.removeItem(GAME_ID_KEY)

const BlackjackProvider = ({ children }) => {
    const [game, setGame] = useState({})
    const [thinking, setThinking] = useState(false)
    const { getRefreshToken, getAccessToken, updateBalance } = useSession()
    const { addNotification } = useNotification()
    const { t } = useLocale()
    const { post, destroy } = useAPI()

    const startGame = async (amount = 0) => {
        setThinking(true)
        const url = `http://${HOST}/v1/blackjack/start`
        console.log("am", amount)
        try {
            const res = await post(url, {
                headers: {
                    "x-refresh-token": getRefreshToken(),
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: {
                    amount: amount,
                },
            })

            if (res.code) {
                throw new Error(res.code)
            }

            if (res.gameId) {
                setGameId(res.gameId)
            }

            console.log("start", res)
            setGame(res)
        } catch (error) {
            addNotification(t(`message.error.${error.message}`), "error")
        } finally {
            setThinking(false)
        }
    }

    const continueGame = async () => {
        setThinking(true)
        const url = `http://${HOST}/v1/blackjack/${getGameId()}`

        try {
            const res = await post(url, {
                headers: {
                    "x-refresh-token": getRefreshToken(),
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            })

            if (res.code) {
                throw new Error(res.code)
            }

            if (res.gameId) {
                setGameId(res.gameId)
            }

            console.log("continue", res)
            setGame(res)
        } catch (error) {
            addNotification(t(`message.error.${error.message}`), "error")
        } finally {
            setThinking(false)
        }
    }

    const finishGame = async (game) => {
        const winner = game.winners[0]
        let type
        let message
        if (winner === "dealer") {
            type = "error"
            message = "You loss ;-;"
        } else if (winner === "player") {
            type = "success"
            message = "You win!!!"
        } else if (winner === "Tie") {
            type = "info"
            message = "Tie -_-"
        }
        addNotification(message, type)
        updateBalance("deposit", game?.payout)

        setThinking(true)
        const url = `http://${HOST}/v1/blackjack/${getGameId()}`

        try {
            const res = await destroy(url, {
                headers: {
                    "x-refresh-token": getRefreshToken(),
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            })

            if (res.code !== "GAME_DELETED_SUCCESSFULLY") {
                throw new Error(res.code)
            }

            console.log("end", res)
            setTimeout(() => {
                setGame({})
            }, 2000)
            removeGameId()
            addNotification(t(`message.success.${res.code}`), "success")
        } catch (error) {
            addNotification(error.message, "error")
        } finally {
            setThinking(false)
        }
    }

    const play = async (action) => {
        setThinking(true)
        const url = `http://${HOST}/v1/blackjack/${getGameId()}/${action}`

        try {
            const res = await post(url, {
                headers: {
                    "x-refresh-token": getRefreshToken(),
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            })

            if (res.code) {
                throw new Error(res.code)
            }

            console.log("currentState", res)
            setGame(res)
        } catch (error) {
            addNotification(t(`message.error.${error.message}`), "error")
        } finally {
            setThinking(false)
        }
    }

    const hit = async () => await play("hit")
    const stand = async () => await play("stand")
    const double = async () => await play("double")
    const split = async () => await play("split")

    useEffect(() => {
        if (getGameId()) {
            continueGame()
        }
    }, [])

    const value = {
        game,
        startGame,
        continueGame,
        finishGame,
        hit,
        stand,
        double,
        split,
        thinking,
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
