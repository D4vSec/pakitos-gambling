/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import useAPI from "@/hooks/useAPI"
import { useNotification } from "@/providers/NotificationProvider"
import { useSession } from "./SessionProvider"
import { useLocale } from "./LocaleProvider"

const CapyroadContext = createContext()

const GAME_ID_KEY = "capyroadGameId"

const getGameId = () => localStorage.getItem(GAME_ID_KEY)
const setGameId = (id) => localStorage.setItem(GAME_ID_KEY, id)
const removeGameId = () => localStorage.removeItem(GAME_ID_KEY)

const CapyroadProvider = ({ children }) => {
  const [game, setGame] = useState({})
  const [betAmount, setBetAmount] = useState("")
  const [lastBetAmount, setLastBetAmount] = useState("")
  const [dealQueue, setDealQueue] = useState([])
  const [isActionPending, setIsActionPending] = useState(false)
  const [isOutcomeAnimationRunning, setOutcomeAnimationRunning] = useState(false)

  const { user, getRefreshToken, getAccessToken, updateBalance } = useSession()
  const { balance } = user
  const { addNotification } = useNotification()
  const { t } = useLocale()
  const { get, post, destroy } = useAPI()

  const gameRef = useRef({})
  const clearGameTimeoutRef = useRef(null)

  const updateBetAmount = (amount) => setBetAmount(amount)
  const clearBet = () => setBetAmount("")
  const repeatBet = () => setBetAmount(lastBetAmount)
  const doubleBet = () => setBetAmount((prev) => formatMoney(prev * 2))

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

  const formatGame = (source) => {
    const rawGame =
      source?.game && typeof source.game === "object" ? source.game : source

    if (!rawGame || typeof rawGame !== "object") {
      return {}
    }

    const gameId = rawGame.gameId || rawGame.gameID
    const info = rawGame.info || {}

    return {
      ...rawGame,
      gameId,
      gameID: rawGame.gameID || gameId,
      amount: formatMoney(rawGame.amount || 0),
      payout: formatMoney(rawGame.payout || 0),
      info: {
        ...info,
        road: Number(info.road || 0),
        crashProbability: Number(info.crashProbability || 0),
        payoutMultiplier: formatMoney(info.payoutMultiplier || 1),
        isCrashed: Boolean(info.isCrashed),
        multipliers: Array.isArray(info.multipliers)
          ? info.multipliers.map((multiplier) => formatMoney(multiplier))
          : [],
      },
    }
  }

  const getRoundResult = (currentGame) => {
    const payout = Number(currentGame?.payout || 0)
    const amount = Number(currentGame?.amount || 0)

    if (payout > amount) return { type: "success", message: "win" }
    if (payout < amount) return { type: "error", message: "lose" }
    return { type: "info", message: "tie" }
  }

  const onQueueAnimation = (event) => {
    setDealQueue((prev) => [...prev, event])
  }

  const completeQueuedAnimation = (eventId) => {
    setDealQueue((prev) => prev.filter((event) => event.id !== eventId))
  }

  const resetAnimationState = () => {
    setDealQueue([])
  }

  const applyGameUpdate = (nextGame, { animate = true } = {}) => {
    const formattedGame = formatGame(nextGame)

    gameRef.current = formattedGame

    if (!animate) {
      setDealQueue([])
    }

    setGame(formattedGame)
  }

  const getAuthHeaders = () => ({
    "x-refresh-token": getRefreshToken(),
    Authorization: `Bearer ${getAccessToken()}`,
  })

  const getCurrentGameId = () => gameRef.current?.gameId || getGameId()

  const startGame = async () => {
    if (isOutcomeAnimationRunning || !theresAmount()) return

    if (clearGameTimeoutRef.current) {
      clearTimeout(clearGameTimeoutRef.current)
      clearGameTimeoutRef.current = null
    }

    try {
      const res = await post("/api/v1/capyroad/start", {
        headers: getAuthHeaders(),
        body: {
          amount: formatMoney(betAmount),
        },
      })

      if (res.code) throw new Error(res.code)

      const nextGame = formatGame(res)

      if (!nextGame.gameId) {
        throw new Error("GAME_NOT_VALID")
      }

      setGameId(nextGame.gameId)
      updateBalance("withdrawal", betAmount)
      setLastBetAmount(betAmount)
      applyGameUpdate(nextGame)
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const continueGame = async () => {
    const requestedGameId = getGameId()

    if (!requestedGameId) return

    try {
      const res = await get(`/api/v1/capyroad/${requestedGameId}`, {
        headers: getAuthHeaders(),
      })

      if (res.code) throw new Error(res.code)

      const nextGame = formatGame(res)

      if (getGameId() !== requestedGameId && gameRef.current?.gameId !== requestedGameId) {
        return
      }

      if (nextGame.gameId) {
        setGameId(nextGame.gameId)
      }

      applyGameUpdate(nextGame, { animate: false })
      setBetAmount(formatMoney(nextGame.amount))

      if (nextGame.status === "finished") {
        await finishGame(nextGame, { syncBalance: false })
      }
    } catch (error) {
      if (
        ["GAME_NOT_FOUND", "GAME_NOT_VALID"].includes(error.message) &&
        getGameId() === requestedGameId &&
        (!gameRef.current?.gameId || gameRef.current?.gameId === requestedGameId)
      ) {
        removeGameId()
        gameRef.current = {}
        setGame({})
        setDealQueue([])
      }

      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const finishGame = async (currentGame, options = {}) => {
    const { syncBalance = true } = options
    const formattedGame = formatGame(currentGame)
    const { type, message } = getRoundResult(formattedGame)
    const finishedGameId = formattedGame?.gameId

    setOutcomeAnimationRunning(false)

    addNotification(t(`games.result.${message}`), type, {
      scope: "games",
      duration: 3000,
      payout: formattedGame?.payout,
    })

    if (syncBalance) {
      updateBalance("deposit", formattedGame?.payout)
    }

    try {
      const res = await destroy(`/api/v1/capyroad/${finishedGameId || getCurrentGameId()}`, {
        headers: getAuthHeaders(),
      })

      if (res.code !== "GAME_DELETED_SUCCESSFULLY") {
        throw new Error(res.code)
      }

      clearGameTimeoutRef.current = setTimeout(() => {
        if (gameRef.current?.gameId === finishedGameId) {
          gameRef.current = {}
          setGame({})
        }

        clearGameTimeoutRef.current = null
      }, 3000)

      removeGameId()
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const play = async (action) => {
    const currentGameId = getCurrentGameId()

    if (!currentGameId) {
      addNotification(t("message.error.GAME_NOT_FOUND"), "error")
      return
    }

    try {
      setIsActionPending(true)

      const res = await post(`/api/v1/capyroad/${currentGameId}/${action}`, {
        headers: getAuthHeaders(),
      })

      if (res.code) throw new Error(res.code)

      const nextGame = formatGame(res)
      applyGameUpdate(nextGame)

    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    } finally {
      setIsActionPending(false)
    }
  }

  const jumpRoad = async () => await play("jump")
  const stand = async () => await play("stand")

  // Matches Blackjack: restore any persisted session once on mount.
  useEffect(() => {
    if (getGameId()) {
      continueGame()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!game?.gameId) {
      gameRef.current = {}
      setGame({})
      setDealQueue([])
      setOutcomeAnimationRunning(false)
    }
  }, [game?.gameId])

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
    jumpRoad,
    stand,
    dealQueue,
    onQueueAnimation,
    completeQueuedAnimation,
    resetAnimationState,
    isActionPending,
    isOutcomeAnimationRunning,
    setOutcomeAnimationRunning,
  }

  return <CapyroadContext value={value}>{children}</CapyroadContext>
}

export default CapyroadProvider

export const useCapyroad = () => {
  const context = useContext(CapyroadContext)

  if (!context) {
    throw new Error("Provider outside scope")
  }

  return context
}
