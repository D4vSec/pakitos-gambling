import React, { useLayoutEffect } from "react"
import AnimatedDealCard from "./AnimatedDealCard"

const FLIP_DURATION = 500
const TRAVEL_DURATION = 0.3
const VALUE_REVEAL_DELAY = FLIP_DURATION / 2
const NEXT_DEAL_DELAY = 0.28

const CardAnimationsLayer = ({
  dealQueue,
  deckRef,
  cardRefs,
  cardRectsRef,
  onCardStateChange,
  onEventComplete,
}) => {
  const event = dealQueue[0]

  useLayoutEffect(() => {
    if (!event || event.type !== "REVEAL_CARD") return undefined

    const revealTimer = setTimeout(() => {
      onCardStateChange(event.card.id, "faceUp")
    }, 80)

    const completeTimer = setTimeout(() => {
      onEventComplete(event.id)
    }, VALUE_REVEAL_DELAY + 120)

    return () => {
      clearTimeout(revealTimer)
      clearTimeout(completeTimer)
    }
  }, [event, onCardStateChange, onEventComplete])

  useLayoutEffect(() => {
    if (!event || event.type !== "MOVE_CARD") return undefined

    const completeTimer = setTimeout(() => {
      onCardStateChange(event.card.id, "faceUp")
      onEventComplete(event.id)
    }, 120)

    return () => clearTimeout(completeTimer)
  }, [event, onCardStateChange, onEventComplete])

  if (!event || event.type !== "DEAL_CARD") return null

  return (
    <AnimatedDealCard
      key={event.id}
      event={event}
      isLastEvent={dealQueue.length === 1}
      deckRef={deckRef}
      cardRefs={cardRefs}
      cardRectsRef={cardRectsRef}
      onCardStateChange={onCardStateChange}
      onEventComplete={onEventComplete}
      travelDuration={TRAVEL_DURATION}
      valueRevealDelay={VALUE_REVEAL_DELAY}
      nextDealDelay={NEXT_DEAL_DELAY}
    />
  )
}

export default CardAnimationsLayer
