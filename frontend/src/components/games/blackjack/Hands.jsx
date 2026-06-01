import React, { useEffect, useState } from "react"
import Hand from "./Hand"

const Hands = ({
  player,
  hands,
  gameState,
  cardRefs,
  cardStates,
  canFadeOut,
}) => {
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
    const reset = setTimeout(() => {
      setFade(false)
      setVisible(true)
    }, 0)

    if (canFadeOut) {
      const t = setTimeout(() => setFade(true), 2300)
      const t2 = setTimeout(() => setVisible(false), 3000)

      return () => {
        clearTimeout(reset)
        clearTimeout(t)
        clearTimeout(t2)
      }
    }

    return () => clearTimeout(reset)
  }, [canFadeOut, gameState])

  if (!safeHands.length || !visible) return null

  return (
    <div
      className={`
        flex max-w-full items-center justify-center gap-3 sm:gap-5 md:gap-6 lg:gap-8
        transition-opacity duration-700 ease-out
        ${fade ? "opacity-0" : "opacity-100"}
      `}>
      {safeHands.map((hand, i) => (
        <Hand
          key={i}
          hand={hand}
          isActive={player !== "dealer" && hasSplit && i === activeIndex}
          cardRefs={cardRefs}
          cardStates={cardStates}
          handIndex={i}
          owner={player}
        />
      ))}
    </div>
  )
}

export default Hands
