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

// TODO: Revisar lso payouts con el split o no se q coño pasa
const BlackjackProvider = ({ children }) => {
  const [game, setGame] = useState({})
  const [betAmount, setBetAmount] = useState("")
  const [lastBetAmount, setLastBetAmount] = useState("")
  const [baseBet, setBaseBet] = useState("")
  const [allShown, setAllShown] = useState(false)
  const [dealQueue, setDealQueue] = useState([])

  const { user, getRefreshToken, getAccessToken, updateBalance } = useSession()
  const { balance } = user
  const { addNotification } = useNotification()
  const { t } = useLocale()
  const { get, post, destroy } = useAPI()

  const updateAllShown = (value) => setAllShown(value)
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

  const formatGame = (game) => {
    if (!game) return game

    const generateCardId = (card, owner, handIndex, cardIndex) => {
      return `${game.gameId}-${owner}-${handIndex}-${card.rank}-${card.suit}-${cardIndex}`
    }

    const formatHand = (hand, owner, handIndex) => {
      if (!hand?.hand) return hand

      return {
        ...hand,
        hand: hand.hand.map((card, i) => ({
          ...card,
          id: card.id || generateCardId(card, owner, handIndex, i),
        })),
      }
    }

    return {
      ...game,

      player: Array.isArray(game.player)
        ? game.player.map((hand, handIndex) =>
            formatHand(hand, "player", handIndex),
          )
        : game.player,

      dealer: Array.isArray(game.dealer)
        ? game.dealer.map((hand, handIndex) =>
            formatHand(hand, "dealer", handIndex),
          )
        : game.dealer,
    }
  }

  const getGlobalWinner = (winners = []) => {
    const counts = winners.reduce((acc, w) => {
      acc[w] = (acc[w] || 0) + 1
      return acc
    }, {})

    const entries = Object.entries(counts)

    if (entries.length === 0) return null

    const max = Math.max(...entries.map(([, v]) => v))
    const top = entries.filter(([, v]) => v === max)

    if (top.length > 1) return "tie"

    return top[0][0]
  }

  const onQueueAnimation = (event) => {
    setDealQueue((prev) => [...prev, event])
  }

  const resetAnimationState = () => {
    dealQueue.length = 0
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

      setGame(formatGame(res))
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

      setGame(formatGame(res))

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
    const winner = getGlobalWinner(game?.winners)
    let type =
      winner === "dealer" ? "error" : winner === "player" ? "success" : "info"
    let message =
      winner === "dealer" ? "lose" : winner === "player" ? "win" : "tie"

    addNotification(t(`games.result.${message}`), type, {
      scope: "games",
      duration: 3000,
      payout: game?.payout,
    })

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
      }, 4000)

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

      setGame(formatGame(res))
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

  useEffect(() => {
    console.log("GAME UPDATED", game)
  }, [game])

  useEffect(() => {
    if (game?.player?.length > 0) {
      onQueueAnimation({
        id: "test",
        type: "DEAL_CARD",
        card: game.player[0].hand[0],
        to: "player",
      })
    }
  }, [game])

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
    dealQueue,
    onQueueAnimation,
    resetAnimationState,
    allShown,
    updateAllShown,
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
