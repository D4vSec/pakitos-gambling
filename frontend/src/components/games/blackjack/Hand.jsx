import React from "react"
import Card from "./Card"

const Hand = ({ hand, isActive, cardRefs, cardStates }) => {
  const cards = Array.isArray(hand?.hand) ? hand.hand : []

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
    <div className="z-10 flex flex-col gap-3 justify-center items-center">
      {cards.length > 0 && (
        <div className="flex items-start">
          {cards.map((card, i) => {
            const state = getCardState(card)

            return (
              <div
                key={card.id || `${card.rank}-${card.suit}-${i}`}
                className={i !== 0 ? "-ml-10" : ""}>
                <div
                  ref={(el) => {
                    if (card.id && cardRefs?.current) {
                      cardRefs.current[card.id] = el
                    }
                  }}
                  style={{
                    marginTop: `${i * 1}rem`,
                  }}>
                  {state === "pending" ? (
                    <div className="w-17 h-23 md:w-20 md:h-28" />
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

      <p className="font-bold text-xl">{displayValue}</p>
    </div>
  )
}

export default Hand
