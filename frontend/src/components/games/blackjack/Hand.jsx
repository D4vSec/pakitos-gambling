import React from "react"
import Card from "./Card"

const Hand = ({ hand, isActive, cardRefs }) => {
  const cards = Array.isArray(hand?.hand) ? hand.hand : []

  // filtramos cartas visibles para cálculos (evita "hidden" y NaN)
  const visibleCards = cards.filter(
    (c) => c.rank !== "hidden" && c.suit !== "hidden",
  )

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
          {cards.map((card, i) => (
            <div
              key={card.id || `${card.rank}-${card.suit}-${i}`}
              ref={(el) => {
                if (card.id && cardRefs?.current) {
                  cardRefs.current[card.id] = el
                }
              }}
              className={i !== 0 ? "-ml-10" : ""}>
              <div style={{ marginTop: `${i * 1}rem` }}>
                <Card
                  key={i}
                  card={card}
                  forceHidden={false}
                  isActive={isActive}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="font-bold text-xl">{displayValue}</p>
    </div>
  )
}

export default Hand
