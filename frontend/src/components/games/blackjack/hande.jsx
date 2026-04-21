import React, { useState, useEffect, useRef } from "react"
import Card from "./Card"

const Hand = ({ hand }) => {
  const cards = hand?.hand || []

  const [revealedCount, setRevealedCount] = useState(0)
  const prevLengthRef = useRef(0)
  const isRevealingRef = useRef(false)

  useEffect(() => {
    const prev = prevLengthRef.current
    const current = cards.length

    const isReset = current < prev
    const hasNew = current > prev

    if (isReset) {
      setRevealedCount(0)
      isRevealingRef.current = false
    }

    if (hasNew && !isRevealingRef.current) {
      revealSequentially(prev)
    }

    prevLengthRef.current = current
  }, [cards])

  const revealSequentially = (start) => {
    isRevealingRef.current = true

    let i = start

    const reveal = () => {
      setRevealedCount(i + 1)
      i++

      if (i < cards.length) {
        setTimeout(reveal, 700)
      } else {
        isRevealingRef.current = false
      }
    }

    reveal()
  }

  const visibleCards = cards.filter((card) => card.rank !== "hidden")
  const hasCards = visibleCards.length > 0

  const getCardValue = (rank) => {
    if (rank === "A") return 1
    if (["J", "Q", "K"].includes(rank)) return 10
    return Number(rank)
  }

  const lowValue = hasCards
    ? visibleCards.reduce((acc, card) => acc + getCardValue(card.rank), 0)
    : 0

  const hasAce = visibleCards.some((card) => card.rank === "A")
  const highValue = hasAce ? lowValue + 10 : lowValue

  let displayValue = lowValue

  if (hasAce && highValue <= 21) {
    displayValue = `${lowValue}/${highValue}`
  }

  return (
    <div className="z-10 flex flex-col gap-3 justify-center items-center">
      {hasCards && (
        <div className="flex items-start">
          {cards.slice(0, revealedCount).map((card, i) => (
            <div
              key={`${card.rank}-${card.suit}-${i}`}
              className={i !== 0 ? "-ml-10" : ""}>
              <div style={{ marginTop: `${i * 1}rem` }}>
                <Card
                  card={card}
                  reveal={true}
                  forceHidden={card.rank === "hidden" || card.suit === "hidden"}
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
