import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
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

  const prevGameRef = useRef(null)

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

  const cardRegistry = useRef(new Map())

  const getCardId = (gameId, owner, handIndex, dealIndex) => {
    const key = `${gameId}-${owner}-${handIndex}-${dealIndex}`

    if (!cardRegistry.current.has(key)) {
      cardRegistry.current.set(key, crypto.randomUUID())
    }

    return cardRegistry.current.get(key)
  }

  const formatGame = (game) => {
    if (!game) return game

    let globalDealIndex = 0

    const formatHand = (hand, owner, handIndex) => {
      if (!hand?.hand) return hand

      return {
        ...hand,
        hand: hand.hand.map((card) => ({
          ...card,
          id: getCardId(game.gameId, owner, handIndex, globalDealIndex++),
        })),
      }
    }

    return {
      ...game,

      player: Array.isArray(game.player)
        ? game.player.map((hand, i) => formatHand(hand, "player", i))
        : game.player,

      dealer: Array.isArray(game.dealer)
        ? game.dealer.map((hand, i) => formatHand(hand, "dealer", i))
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

    try {
      const res = await post("/api/v1/blackjack/start", {
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
    try {
      const res = await get(`/api/v1/blackjack/${getGameId()}`, {
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

    try {
      const res = await destroy(`/api/v1/blackjack/${getGameId()}`, {
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
    try {
      const res = await post(`/api/v1/blackjack/${getGameId()}/${action}`, {
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

  const sortDealOrder = (events) => {
    const order = { player: 0, dealer: 1 }

    return [...events].sort((a, b) => {
      if (a.cardIndex === b.cardIndex) {
        return order[a.to] - order[b.to]
      }
      return a.cardIndex - b.cardIndex
    })
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
    if (!game) return

    const prev = prevGameRef.current
    if (!prev) {
      prevGameRef.current = game
      return
    }

    const events = []

    const processHands = (prevHands = [], currentHands = [], owner) => {
      currentHands.forEach((hand, handIndex) => {
        const prevCount = prevHands?.[handIndex]?.hand?.length || 0
        const currentCount = hand?.hand?.length || 0

        if (currentCount > prevCount) {
          const newCards = hand.hand.slice(prevCount, currentCount)

          newCards.forEach((card, i) => {
            const eventId = `${game.gameId}-${owner}-${handIndex}-${prevCount + i}`

            events.push({
              id: eventId,
              type: "DEAL_CARD",
              card: {
                ...card,
                faceDown: owner === "dealer" && card.rank === "hidden",
              },
              to: owner,
              handIndex,
              cardIndex: prevCount + i,
            })
          })
        }
      })
    }

    processHands(prev.player, game.player, "player")
    processHands(prev.dealer, game.dealer, "dealer")

    const sorted = sortDealOrder(events)

    sorted.forEach((event) => {
      onQueueAnimation(event)
    })

    prevGameRef.current = game
  }, [game])

  useEffect(() => {
    if (!game?.gameId) {
      setGame({})
      setDealQueue([])
      cardRegistry.current.clear()
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
