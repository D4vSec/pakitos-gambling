import React from "react"
import Card from "./Card"

const Deck = ({ deckRef }) => {
  const deck = Array.from({ length: 10 }, () => ({
    rank: "hidden",
    suit: "hidden",
  }))

  return (
    <div ref={deckRef} className="relative w-20 h-30 md:h-36 ">
      {deck.map((card, i) => (
        <div key={i} className="absolute" style={{ bottom: i * 1 }}>
          <Card key={i} card={card} forceHidden />
        </div>
      ))}
    </div>
  )
}

export default Deck
