import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Hands from "../Hands"
import Deck from "../Deck"
import CardAnimationsLayer from "../CardAnimationsLayer"
import { useBlackjack } from "@/providers/BlackjackProvider"
import { useLocale } from "@/providers/LocaleProvider"
import "./BlackjackBoard.css"

const isHiddenCard = (card) => card?.rank === "hidden" || card?.suit === "hidden"

const BlackjackBoard = () => {
  const { game, finishGame, dealQueue, completeQueuedAnimation } = useBlackjack()
  const { dealer, player } = game || {}
  const { t } = useLocale()

  const deckRef = useRef(null)
  const cardRefs = useRef({})
  const cardRectsRef = useRef({})
  const finishedGameRef = useRef(null)
  const [cardStateOverrides, setCardStateOverrides] = useState({})

  const gameCards = useMemo(() => {
    const cards = []

    if (Array.isArray(player)) {
      player.forEach((hand) => cards.push(...(hand?.hand || [])))
    }

    if (Array.isArray(dealer)) {
      dealer.forEach((hand) => cards.push(...(hand?.hand || [])))
    }

    return cards
  }, [dealer, player])

  const cardStates = useMemo(() => {
    const queuedDealIds = new Set(
      dealQueue.filter((event) => event.type === "DEAL_CARD").map((event) => event.card.id),
    )

    const queuedRevealIds = new Set(
      dealQueue.filter((event) => event.type === "REVEAL_CARD").map((event) => event.card.id),
    )

    return gameCards.reduce((acc, card) => {
      if (queuedRevealIds.has(card.id) && cardStateOverrides[card.id] !== "faceUp") {
        acc[card.id] = "faceDown"
        return acc
      }

      if (cardStateOverrides[card.id]) {
        acc[card.id] = cardStateOverrides[card.id]
        return acc
      }

      if (queuedDealIds.has(card.id)) {
        acc[card.id] = "pending"
        return acc
      }

      if (isHiddenCard(card)) {
        acc[card.id] = "faceDown"
        return acc
      }

      acc[card.id] = "faceUp"
      return acc
    }, {})
  }, [cardStateOverrides, dealQueue, gameCards])

  useEffect(() => {
    if (!game || Object.keys(game).length === 0) {
      cardRefs.current = {}
      cardRectsRef.current = {}
      finishedGameRef.current = null
    }
  }, [game])

  useEffect(() => {
    if (
      game?.status === "finished" &&
      dealQueue.length === 0 &&
      finishedGameRef.current !== game.gameId
    ) {
      finishedGameRef.current = game.gameId
      finishGame(game)
    }
  }, [dealQueue.length, finishGame, game])

  const currentCardIds = useMemo(() => new Set(gameCards.map((card) => card.id)), [gameCards])

  const updateCardState = useCallback(
    (cardId, state) => {
      setCardStateOverrides((prev) => ({
        ...Object.fromEntries(Object.entries(prev).filter(([id]) => currentCardIds.has(id))),
        [cardId]: state,
      }))
    },
    [currentCardIds],
  )

  const finishedAndShown = game?.status === "finished" && dealQueue.length === 0

  return (
    <div className="w-full h-full grid grid-cols-[1fr_3fr_1fr] grid-rows-[repeat(4,1fr)] gap-4 bg-linear-to-b from-emerald-900 via-green-800 to-green-900">
      <div className="dealer flex justify-center items-center">
        <Hands
          player={"dealer"}
          hands={dealer}
          gameState={game?.status}
          cardRefs={cardRefs}
          cardStates={cardStates}
          canFadeOut={finishedAndShown}
        />
      </div>

      <div className="player flex justify-center items-center">
        <Hands
          player={"player"}
          hands={player}
          gameState={game?.status}
          cardRefs={cardRefs}
          cardStates={cardStates}
          canFadeOut={finishedAndShown}
        />
      </div>

      <div className="deck flex justify-center items-start">
        <Deck deckRef={deckRef} />
      </div>

      <div className="opacity-80 bg-blackjack flex justify-center items-center">
        <div className="bg-primary px-10 py-2 rounded-md shadow-md transform -skew-x-12">
          <p className="font-bold text-xl text-white skew-x-12">{t("games.blackjack.bkPays")}</p>
        </div>
      </div>

      <CardAnimationsLayer
        dealQueue={dealQueue}
        deckRef={deckRef}
        cardRefs={cardRefs}
        cardRectsRef={cardRectsRef}
        onCardStateChange={updateCardState}
        onEventComplete={completeQueuedAnimation}
        gameId={game?.gameId}
      />
    </div>
  )
}

export default BlackjackBoard
