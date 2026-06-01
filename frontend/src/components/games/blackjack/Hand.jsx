import React from "react"
import Card from "./Card"

const Hand = ({ hand, isActive, cardRefs, cardStates }) => {
  const cards = Array.isArray(hand?.hand) ? hand.hand : []
  const stackOffsetClass =
    cards.length >= 5
      ? "-ml-6 sm:-ml-7 md:-ml-8 lg:-ml-9"
      : "-ml-7 sm:-ml-8 md:-ml-9 lg:-ml-10"

  const getCardState = (card) => {
    if (cardStates?.[card.id]) return cardStates[card.id]
    if (card.rank === "hidden" || card.suit === "hidden") return "faceDown"
    return "faceUp"
  }

  const visibleCards = cards.filter((card) => {
    const state = getCardState(card)

    return (
      state === "faceUp" && card.rank !== "hidden" && card.suit !== "hidden"
    )
  })

  const getCardValue = (rank) => {
    if (!rank) return 0
    if (rank === "hidden") return 0
    if (rank === "A") return 1
    if (["J", "Q", "K"].includes(rank)) return 10
    if (isNaN(Number(rank))) return 0
    return Number(rank)
  }

  const lowValue = visibleCards.reduce(
    (acc, card) => acc + getCardValue(card.rank),
    0,
  )

  const hasAce = visibleCards.some((card) => card.rank === "A")
  const highValue = hasAce ? lowValue + 10 : lowValue

  let displayValue = lowValue

  if (hasAce && highValue <= 21) {
    displayValue = `${lowValue}/${highValue}`
  }

  return (
    <div className="flex max-w-full flex-col items-center justify-center gap-2 sm:gap-3">
      {cards.length > 0 && (
        <div className="flex max-w-full items-start px-1">
          {cards.map((card, i) => {
            const state = getCardState(card)

            return (
              <div
                key={card.id || `${card.rank}-${card.suit}-${i}`}
                className={i !== 0 ? stackOffsetClass : ""}>
                <div
                  ref={(el) => {
                    if (card.id && cardRefs?.current) {
                      cardRefs.current[card.id] = el
                    }
                  }}
                  style={{
                    marginTop: `${i * 0.65}rem`,
                  }}>
                  {state === "pending" ? (
                    <div className="w-[clamp(3.75rem,8vw,5rem)] lg:w-[clamp(5.5rem,6vw,6rem)] aspect-5/7" />
                  ) : (
                    <Card
                      card={card}
                      forceHidden={state === "faceDown"}
                      isActive={isActive}
                      flipped={state === "faceUp"}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-lg font-bold sm:text-xl">{displayValue}</p>
    </div>
  )
}

export default Hand
