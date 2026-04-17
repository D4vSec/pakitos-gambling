import React from "react"
import Hand from "./Hand"

const Hands = ({ player, hands, gameState }) => {
  if (!Array.isArray(hands) || hands.length === 0) return null

  const hasSplit = hands.length > 1

  const activeIndex =
    gameState === "finished"
      ? null
      : hasSplit
        ? hands.findIndex((hand) => !hand.resolved)
        : null

  return (
    <div className="flex gap-8">
      {hands.map((hand, i) => (
        <Hand
          key={i}
          hand={hand}
          isActive={player !== "dealer" && hasSplit && i === activeIndex}
        />
      ))}
    </div>
  )
}

export default Hands
