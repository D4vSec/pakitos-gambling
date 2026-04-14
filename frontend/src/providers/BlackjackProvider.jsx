import React, { createContext, useContext, useEffect, useState } from "react"
import useAPI from "@/hooks/useAPI"
import { useNotification } from "@/providers/NotificationProvider"
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
  const [betAmount, setBetAmount] = useState("")
  const [lastBetAmount, setLastBetAmount] = useState("")

  const { getRefreshToken, getAccessToken, updateBalance } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()
  const { get, post, destroy } = useAPI()

  const updateBetAmount = (amount) => setBetAmount(amount)
  const clearBet = () => setBetAmount(0)
  const repeatBet = () => setBetAmount(lastBetAmount)
  const doubleBet = () => setBetAmount((prev) => prev * 2)

  const startGame = async () => {
    updateBalance("withdrawal", betAmount)
    setLastBetAmount(betAmount)

    const url = `http://${HOST}/v1/blackjack/start`
    console.log("am", betAmount)

    try {
      const res = await post(url, {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: {
          amount: betAmount,
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
    }
  }

  const continueGame = async () => {
    const url = `http://${HOST}/v1/blackjack/${getGameId()}`

    try {
      const res = await get(url, {
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
      setBetAmount(
        res?.player?.map((hand) => hand.bet).reduce((acc, bet) => acc + bet, 0),
      )
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const finishGame = async (game) => {
    const winner = game.winners[0]
    let type
    let message
    if (winner === "dealer") {
      type = "error"
      message = "lose"
    } else if (winner === "player") {
      type = "success"
      message = "win"
    } else if (winner === "Tie") {
      type = "info"
      message = "tie"
    }

    addNotification(t(`games.result.${message}`), type)
    updateBalance("deposit", game?.payout)

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

      // Para que las cartas no desaparezcan instantáneamente
      setTimeout(() => {
        setGame({})
      }, 3000)
      removeGameId()
      addNotification(t(`message.success.${res.code}`), "success")
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const play = async (action) => {
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
    }
  }

  const hit = async () => await play("hit")
  const stand = async () => await play("stand")
  const double = async () => {
    await play("double")
    setBetAmount((prev) => prev * 2)
    setLastBetAmount((prev) => prev * 2)
    updateBalance("withdrawal", betAmount)
  }
  const split = async () => {
    await play("split")
    setBetAmount((prev) => prev * 2)
    setLastBetAmount((prev) => prev * 2)
    updateBalance("withdrawal", betAmount)
  }

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
    betAmount,
    updateBetAmount,
    clearBet,
    repeatBet,
    doubleBet,
    hit,
    stand,
    double,
    split,
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
