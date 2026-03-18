import React, { createContext, useContext, useEffect, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useSession } from "./SessionProvider"

const BlackjackContext = createContext()

const GAME_ID_KEY = "blackjackGameId"
const HOST = "localhost:3000"

const getGameId = () => localStorage.getItem(GAME_ID_KEY)
const setGameId = (id) => localStorage.setItem(GAME_ID_KEY, id)
const removeGameId = () => localStorage.removeItem(GAME_ID_KEY)

const BlackjackProvider = ({ children }) => {
    const [game, setGame] = useState({})
    const [thinking, setThinking] = useState(false)
    const { getRefreshToken, getAccessToken } = useSession()
    const { addNotification } = useNotification()
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
            addNotification(error.message, "error")
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
            addNotification(error.message, "error")
        } finally {
            setThinking(false)
        }
    }

    // TODO: Si la carta que se muestra y el jugador tienen el mismo valor se cuenta como empate
    // TODO: Tras hacer hit, stand o double ns que pasa que se auto termina la partida aunque resolved siga en false
    // TODO: Cuando se termina el juego el value de dealer es null y la segunda carta sigue en hidden
    // TODO: Si spliteas con numeros distintos devuelve internal server error, no cannot_split
    // TODO: El juego detecta antes de tiempo que has perdido y no se actualizan las cartas
    // TODO: Se puede apostar dinero en negativo, lo que hace que se te añada a la cuenta
    // TODO: Si apuestas 0 devuelve internal_server_error
    // TODO: El getGame no furula  (hand is not iterable /services/blackjack.js:30:20))
    // TODO: Efectivamente el split no va (id is not defined 328:50)
    // TODO: El calculo del dealer creo que en el momento que tiene más que el player se para
    const finishGame = async () => {
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
            setGame({})
            removeGameId()
            addNotification(res.code, "success")
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
            addNotification(error.message, "error")
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
