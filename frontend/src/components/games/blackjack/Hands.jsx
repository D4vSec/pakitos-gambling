import React, { useEffect, useState } from "react"
import Hand from "./Hand"

const Hands = ({ player, hands, gameState }) => {
  const [fade, setFade] = useState(false)
  const [visible, setVisible] = useState(true)

  const safeHands = Array.isArray(hands) ? hands : []

  const hasSplit = safeHands.length > 1

  const activeIndex =
    gameState === "finished"
      ? null
      : hasSplit
        ? safeHands.findIndex((hand) => !hand.resolved)
        : null

  useEffect(() => {
    if (gameState === "finished") {
      setFade(false)
      setVisible(true)

      const t = setTimeout(() => {
        setFade(true)
      }, 2700)

      const t2 = setTimeout(() => {
        setVisible(false)
      }, 3000)

      return () => {
        clearTimeout(t)
        clearTimeout(t2)
      }
    } else {
      setFade(false)
      setVisible(true)
    }
  }, [gameState])

  if (!safeHands.length || !visible) return null

  return (
    <div
      className={`
        flex gap-8
        transition-opacity duration-700 ease-out
        ${fade ? "opacity-0" : "opacity-100"}
      `}>
      {safeHands.map((hand, i) => (
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
