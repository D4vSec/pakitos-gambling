import React from "react"
import Card from "./Card"

const Deck = ({ deckRef }) => {
  const deck = Array.from({ length: 10 }, () => ({
    rank: "hidden",
    suit: "hidden",
  }))

  return (
    <div
      ref={deckRef}
      className="relative w-[clamp(4.25rem,9vw,5.5rem)] h-[clamp(6.5rem,13vw,8rem)] lg:w-[clamp(6rem,6.5vw,6.5rem)] lg:h-[clamp(8.75rem,9vw,9.5rem)]"
    >
      {deck.map((card, i) => (
        <div key={i} className="absolute" style={{ bottom: i * 1 }}>
          <Card key={i} card={card} forceHidden />
        </div>
      ))}
    </div>
  )
}

export default Deck
