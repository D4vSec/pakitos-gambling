import React from "react"
import Hand from "./Hand"

const Hands = ({ hands }) => {
  if (!Array.isArray(hands) || hands.length === 0) return null

  return (
    <div className="flex gap-8">
      {hands.map((hand, i) => (
        <Hand key={i} hand={hand} />
      ))}
    </div>
  )
}

export default Hands
