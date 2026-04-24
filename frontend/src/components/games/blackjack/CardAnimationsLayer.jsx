import React, { useEffect, useState } from "react"
import Card from "./Card"

const CardAnimationsLayer = ({ dealQueue, deckRef }) => {
  const getDeckPosition = () => {
    const rect = deckRef.current?.getBoundingClientRect()
    if (!rect) return { top: 0, left: 0 }

    return {
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
    }
  }

  const deckPos = getDeckPosition()

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {dealQueue.map((event, i) => (
        <div
          key={event.id}
          className="absolute"
          style={{
            top: deckPos.top + i * 20,
            left: deckPos.left + i * 20,
            transform: "translate(-50%, -50%)",
          }}>
          <Card card={event.card} forceHidden={event.card.faceDown} />
        </div>
      ))}
    </div>
  )
}

export default CardAnimationsLayer
