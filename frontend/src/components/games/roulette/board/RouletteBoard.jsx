import React, { useMemo, useState, useCallback } from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import PlacedChips from "../chips/PlacedChips"
import NumberBet from "./NumberBet"
import ExternalBet from "./ExternalBet"
import { BETTING_GROUPS } from "../rouletteConsts"
import "./RouletteBoard.css"

const RouletteBoard = () => {
  const [hoveredCell, setHoveredCell] = useState(null)

  const { getRouletteValues, updateBets, getChipsForCell } = useRoulette()

  const values = getRouletteValues()

  // 🔥 O(1) lookup en vez de includes
  const highlightedSet = useMemo(() => {
    return new Set(BETTING_GROUPS[hoveredCell] || [])
  }, [hoveredCell])

  const updateHoveredCell = useCallback((cell) => {
    setHoveredCell(cell)
  }, [])

  const handleClick = useCallback(
    (e) => {
      const button = e.target.closest("button")
      if (!button) return

      const item = JSON.parse(button.dataset.info)
      updateBets(item)
    },
    [updateBets],
  )

  const { numbers, externals } = useMemo(() => {
    return values.reduce(
      (acc, cell) => {
        if (cell.type === "number") acc.numbers.push(cell)
        else acc.externals.push(cell)
        return acc
      },
      { numbers: [], externals: [] },
    )
  }, [values])

  return (
    <div
      className="grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(28,1fr)] md:grid-cols-[repeat(28,1fr)] md:grid-rows-[repeat(10,1fr)] gap-1 w-full h-full text-black"
      onClick={handleClick}>
      {numbers.map((cell) => (
        <NumberBet key={cell.text} item={cell} highlightedSet={highlightedSet}>
          <PlacedChips chips={getChipsForCell(cell)} />
        </NumberBet>
      ))}

      {externals.map((cell) => (
        <ExternalBet
          key={cell.text}
          item={cell}
          highlightedSet={highlightedSet}
          onHover={updateHoveredCell}>
          <PlacedChips chips={getChipsForCell(cell)} />
        </ExternalBet>
      ))}
    </div>
  )
}

export default RouletteBoard
