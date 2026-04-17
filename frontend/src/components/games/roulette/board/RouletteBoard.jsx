import React, { useState } from "react"
import BoardPiece from "./BoardPiece"
import { useRoulette } from "@/providers/RouletteProvider"
import PlacedChips from "../chips/PlacedChips"
import NumberBet from "./NumberBet"
import ExternalBet from "./ExternalBet"
import "./RouletteBoard.css"

const RouletteBoard = () => {
  const [hoveredCell, setHoveredCell] = useState(null)

  const updateHoveredCell = (cell) => {
    setHoveredCell(cell)
  }

  const { getRouletteValues, updateBets, getChipsForCell } = useRoulette()

  const values = getRouletteValues()

  const handleClick = (e) => {
    if (e.target.tagName !== "BUTTON") return
    updateBets(JSON.parse(e.target.dataset.info))
  }

  const { numbers, externals } = values.reduce(
    (acc, cell) => {
      if (cell.type === "number") {
        acc.numbers.push(cell)
      } else {
        acc.externals.push(cell)
      }
      return acc
    },
    { numbers: [], externals: [] },
  )

  return (
    <div
      className="grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(28,1fr)] md:grid-cols-[repeat(28,1fr)] md:grid-rows-[repeat(10,1fr)] gap-1 w-full h-full text-black "
      onClick={(e) => handleClick(e)}>
      {numbers.map((cell) => (
        <NumberBet key={cell.text} item={cell} hover={hoveredCell}>
          <PlacedChips chips={getChipsForCell(cell)} />
        </NumberBet>
      ))}
      {externals.map((cell) => (
        <ExternalBet key={cell.text} item={cell} hover={updateHoveredCell}>
          <PlacedChips chips={getChipsForCell(cell)} />
        </ExternalBet>
      ))}
    </div>
  )
}

export default RouletteBoard
