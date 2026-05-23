import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import useAPI from "@/hooks/useAPI"
import { useNotification } from "@/providers/NotificationProvider"
import { useSession } from "./SessionProvider"
import { useLocale } from "./LocaleProvider"

const BlackjackContext = createContext()

const GAME_ID_KEY = "bkGameId"

const getGameId = () => localStorage.getItem(GAME_ID_KEY)
const setGameId = (id) => localStorage.setItem(GAME_ID_KEY, id)
const removeGameId = () => localStorage.removeItem(GAME_ID_KEY)

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

  const gameRef = useRef({})
  const clearGameTimeoutRef = useRef(null)

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

  const getCardId = (gameId, owner, handIndex, cardIndex, card) => {
    if (owner === "dealer" && handIndex === 0 && cardIndex === 1) {
      return `${gameId}-dealer-hole`
    }

    if (card?.rank !== "hidden" && card?.suit !== "hidden") {
      return `${gameId}-${card.rank}-${card.suit}`
    }

    return `${gameId}-${owner}-${handIndex}-${cardIndex}-hidden`
  }

  const formatGame = (game) => {
    if (!game) return game

    const formatHand = (hand, owner, handIndex) => {
      if (!hand?.hand) return hand

      return {
        ...hand,
        hand: hand.hand.map((card, cardIndex) => {
          const shouldHideDealerHole =
            game.status !== "finished" && owner === "dealer" && handIndex === 0 && cardIndex === 1
          const displayCard = shouldHideDealerHole ? { rank: "hidden", suit: "hidden" } : card

          return {
            ...displayCard,
            id: getCardId(game.gameId, owner, handIndex, cardIndex, displayCard),
          }
        }),
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

  const getTotalBet = (game) => {
    if (!Array.isArray(game?.player)) return 0

    return game.player.reduce((total, hand) => total + Number(hand.bet || 0), 0)
  }

  const getRoundResult = (game) => {
    const payout = Number(game?.payout || 0)
    const totalBet = getTotalBet(game)

    if (payout > totalBet) return { type: "success", message: "win" }
    if (payout < totalBet) return { type: "error", message: "lose" }
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

  const getCards = (source, owner) => {
    if (!Array.isArray(source?.[owner])) return []

    return source[owner].flatMap((hand, handIndex) =>
      (hand?.hand || []).map((card, cardIndex) => ({
        card,
        owner,
        handIndex,
        cardIndex,
      })),
    )
  }

  const isHiddenCard = (card) => card?.rank === "hidden" || card?.suit === "hidden"

  const sortByHandPosition = (a, b) => {
    if (a.handIndex !== b.handIndex) return a.handIndex - b.handIndex
    return a.cardIndex - b.cardIndex
  }

  const createDealEvent = (game, cardInfo, sequence) => {
    const reveal = !isHiddenCard(cardInfo.card)

    return {
      id: `${game.gameId}-deal-${cardInfo.card.id}-${sequence}`,
      type: "DEAL_CARD",
      card: {
        ...cardInfo.card,
        faceDown: !reveal,
      },
      to: cardInfo.owner,
      handIndex: cardInfo.handIndex,
      cardIndex: cardInfo.cardIndex,
      reveal,
    }
  }

  const createRevealEvent = (game, cardInfo, sequence) => ({
    id: `${game.gameId}-reveal-${cardInfo.card.id}-${sequence}`,
    type: "REVEAL_CARD",
    card: cardInfo.card,
    to: cardInfo.owner,
    handIndex: cardInfo.handIndex,
    cardIndex: cardInfo.cardIndex,
    reveal: true,
  })

  const createMoveEvent = (game, cardInfo, sequence) => ({
    id: `${game.gameId}-move-${cardInfo.card.id}-${sequence}`,
    type: "MOVE_CARD",
    card: cardInfo.card,
    to: cardInfo.owner,
    handIndex: cardInfo.handIndex,
    cardIndex: cardInfo.cardIndex,
    reveal: true,
  })

  const buildInitialDealEvents = (current) => {
    const events = []
    const playerHand = current?.player?.[0]?.hand || []
    const dealerHand = current?.dealer?.[0]?.hand || []
    const maxCards = Math.max(playerHand.length, dealerHand.length)

    for (let cardIndex = 0; cardIndex < maxCards; cardIndex += 1) {
      if (playerHand[cardIndex]) {
        events.push(
          createDealEvent(
            current,
            {
              card: playerHand[cardIndex],
              owner: "player",
              handIndex: 0,
              cardIndex,
            },
            events.length,
          ),
        )
      }

      if (dealerHand[cardIndex]) {
        events.push(
          createDealEvent(
            current,
            {
              card: dealerHand[cardIndex],
              owner: "dealer",
              handIndex: 0,
              cardIndex,
            },
            events.length,
          ),
        )
      }
    }

    return events
  }

  const buildAnimationEvents = (prev, current) => {
    if (!current?.gameId) return []
    if (!prev?.gameId || prev.gameId !== current.gameId) {
      return buildInitialDealEvents(current)
    }

    const events = []
    const prevCards = [...getCards(prev, "player"), ...getCards(prev, "dealer")]
    const currentPlayerCards = getCards(current, "player")
    const currentDealerCards = getCards(current, "dealer")
    const prevCardIds = new Set(prevCards.map(({ card }) => card.id))

    if (!prev.split && current.split) {
      const movedSplitCards = currentPlayerCards
        .filter(({ card, handIndex }) => prevCardIds.has(card.id) && handIndex > 0)
        .sort(sortByHandPosition)

      movedSplitCards.forEach((cardInfo) => {
        events.push(createMoveEvent(current, cardInfo, events.length))
      })
    }

    currentPlayerCards
      .filter(({ card }) => !prevCardIds.has(card.id))
      .sort(sortByHandPosition)
      .forEach((cardInfo) => {
        events.push(createDealEvent(current, cardInfo, events.length))
      })

    const prevDealerHole = prev?.dealer?.[0]?.hand?.[1]
    const currentDealerHole = current?.dealer?.[0]?.hand?.[1]

    if (isHiddenCard(prevDealerHole) && currentDealerHole && !isHiddenCard(currentDealerHole)) {
      events.push(
        createRevealEvent(
          current,
          {
            card: currentDealerHole,
            owner: "dealer",
            handIndex: 0,
            cardIndex: 1,
          },
          events.length,
        ),
      )
    }

    currentDealerCards
      .filter(({ card }) => !prevCardIds.has(card.id))
      .sort(sortByHandPosition)
      .forEach((cardInfo) => {
        events.push(createDealEvent(current, cardInfo, events.length))
      })

    return events
  }

  const applyGameUpdate = (nextGame, { animate = true } = {}) => {
    const formattedGame = formatGame(nextGame)
    const previousGame = gameRef.current
    const events = animate ? buildAnimationEvents(previousGame, formattedGame) : []

    gameRef.current = formattedGame
    setDealQueue((prev) => [...prev, ...events])
    setGame(formattedGame)
  }

  const startGame = async () => {
    if (!theresAmount()) return
    if (clearGameTimeoutRef.current) {
      clearTimeout(clearGameTimeoutRef.current)
      clearGameTimeoutRef.current = null
    }

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

      applyGameUpdate(res)
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

      applyGameUpdate(res, { animate: false })

      const totalBet = res?.player?.map((hand) => hand.bet).reduce((acc, bet) => acc + bet, 0)

      setBetAmount(formatMoney(totalBet))

      if (res?.player?.length > 0) {
        setBaseBet(res.player[0].bet)
      }
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const finishGame = async (game) => {
    const { type, message } = getRoundResult(game)
    const finishedGameId = game?.gameId

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

      clearGameTimeoutRef.current = setTimeout(() => {
        if (gameRef.current?.gameId === finishedGameId) {
          gameRef.current = {}
          setGame({})
        }

        clearGameTimeoutRef.current = null
      }, 3000)
      removeGameId()
      setBaseBet(0)
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

      applyGameUpdate(res)
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
    if (!game?.gameId) {
      gameRef.current = {}
      setGame({})
      setDealQueue([])
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
    completeQueuedAnimation,
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
