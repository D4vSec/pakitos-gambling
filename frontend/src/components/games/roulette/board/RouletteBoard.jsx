import React, { useMemo, useState, useCallback } from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import PlacedChips from "../chips/PlacedChips"
import NumberBet from "./NumberBet"
import ExternalBet from "./ExternalBet"
import { BETTING_GROUPS } from "../rouletteConsts"
import "./RouletteBoard.css"

// TODO: Mejorar el rendimiento de esto sin cargarme las chips
const RouletteBoard = () => {
  const [hoveredCell, setHoveredCell] = useState(null)

  const { getRouletteValues, updateBets, getChipsForCell } = useRoulette()

  const values = getRouletteValues()

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
      className="
    grid
    grid-cols-10 grid-rows-28
    md:grid-cols-28 md:grid-rows-10
    gap-1
    /* MOBILE (base) */
    h-[calc(100%-1rem)]
    w-[calc(100%-0.5rem)]
    /* SM */
    sm:h-[calc(100%-1.5rem)]
    sm:w-[calc(100%-1rem)]
    /* MD */
    md:h-[calc(100%-2rem)]
    md:w-[calc(100%-1.5rem)]
    /* LG */
    lg:h-[calc(100%-4rem)]
    lg:w-[calc(100%-1rem)]
    /* XL */
    xl:h-[calc(100%-2rem)]
    xl:w-[calc(100%-3rem)]
    /* 2XL */
    2xl:h-[calc(100%-2rem)]
    2xl:w-[calc(100%-6rem)]
    aspect-[10/28] md:aspect-[28/10]
    text-white
  "
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
