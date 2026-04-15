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
  const [baseBet, setBaseBet] = useState("")

  const { user, getRefreshToken, getAccessToken, updateBalance } = useSession()
  const { balance } = user
  const { addNotification } = useNotification()
  const { t } = useLocale()
  const { get, post, destroy } = useAPI()

  const updateBetAmount = (amount) => setBetAmount(amount)
  const clearBet = () => setBetAmount("")
  const repeatBet = () => setBetAmount(lastBetAmount)
  const doubleBet = () => setBetAmount((prev) => prev * 2)

  const theresAmount = () => {
    if (betAmount > Number(balance)) {
      addNotification(t("message.error.INSUFFICIENT_BALANCE"), "error")
      return false
    }
    return true
  }

  const formatMoney = (value) => {
    return Math.round(Number(value) * 100) / 100
  }

  const startGame = async () => {
    if (!theresAmount()) return
    updateBalance("withdrawal", betAmount)
    setLastBetAmount(betAmount)
    setBaseBet(betAmount)

    const url = `http://${HOST}/v1/blackjack/start`

    try {
      const res = await post(url, {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: {
          amount: formatMoney(betAmount),
        },
      })

      if (res.code) throw new Error(res.code)

      if (res.gameId) setGameId(res.gameId)

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

      if (res.code) throw new Error(res.code)

      if (res.gameId) setGameId(res.gameId)

      setGame(res)

      const totalBet = res?.player
        ?.map((hand) => hand.bet)
        .reduce((acc, bet) => acc + bet, 0)

      setBetAmount(formatMoney(totalBet))

      if (res?.player?.length > 0) {
        setBaseBet(res.player[0].bet)
      }
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
    } else {
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

      setTimeout(() => {
        setGame({})
      }, 3000)

      removeGameId()

      setBaseBet(0)

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

      if (res.code) throw new Error(res.code)

      setGame(res)
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const hit = async () => await play("hit")
  const stand = async () => await play("stand")

  const double = async () => {
    if (!theresAmount()) return
    await play("double")
    setBetAmount((prev) => formatMoney(prev * 2))
    updateBalance("withdrawal", formatMoney(baseBet))
  }

  const split = async () => {
    if (!theresAmount()) return
    await play("split")
    setBetAmount((prev) => formatMoney(prev + baseBet))
    updateBalance("withdrawal", formatMoney(baseBet))
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
