import React, { createContext, useContext, useState } from "react"
import { useSession } from "./SessionProvider"
import useAPI from "@/hooks/useAPI"
import { useLocale } from "./LocaleProvider"
import { useNotification } from "./NotificationProvider"

const CapyroadContext = createContext()

const GAME_ID_KEY = "capyRoadId"
const HOST = "localhost:3000"

const getGameId = () => localStorage.getItem(GAME_ID_KEY)
const setGameId = (id) => localStorage.setItem(GAME_ID_KEY, id)
const removeGameId = () => localStorage.removeItem(GAME_ID_KEY)

const CapyroadProvider = ({ children }) => {
  const [game, setGame] = useState({})
  const [betAmount, setBetAmount] = useState("")
  const [lastBetAmount, setLastBetAmount] = useState("")

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

    try {
      const res = await post("7api/v1/capyroad/start", {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: {
          amount: formatMoney(betAmount),
        },
      })

      if (res.code) throw new Error(res.code)

      if (res.gameID) setGameId(res.gameID)

      setGame(res)
      console.log(res)
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const jumpRoad = async () => {
    try {
      const res = await post(`/api/v1/capyroad/${getGameId()}/jump`, {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })

      if (res.code) throw new Error(res.code)

      if (res.gameID) setGameId(res.gameI)

      setGame(res)
      /*
      const totalBet = res?.player
        ?.map((hand) => hand.bet)
        .reduce((acc, bet) => acc + bet, 0)

      setBetAmount(formatMoney(totalBet))

      if (res?.player?.length > 0) {
        setBaseBet(res.player[0].bet)
      }
      */
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const finishGame = async (game) => {
    console.log(game)

    addNotification(t(`games.result.${message}`), type, {
      scope: "games",
      duration: 3000,
      payout: game?.payout,
    })

    updateBalance("deposit", game?.payout)

    try {
      const res = await destroy(`/api/v1/capyroad/${getGameId()}`, {
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
      }, 4000)

      removeGameId()

      addNotification(t(`message.success.${res.code}`), "success")
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }
  const values = {
    game,
    startGame,
    jumpRoad,
    finishGame,
    betAmount,
    updateBetAmount,
    clearBet,
    repeatBet,
    doubleBet,
  }

  return <CapyroadContext value={values}>{children}</CapyroadContext>
}

export default CapyroadProvider

export const useCapyroad = () => {
  const context = useContext(CapyroadContext)

  if (!context) {
    throw new Error("Provider outside scope")
  }

  return context
}
