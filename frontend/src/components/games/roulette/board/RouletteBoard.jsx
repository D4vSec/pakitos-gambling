import React, { useMemo, useRef, useCallback } from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import PlacedChips from "../chips/PlacedChips"
import NumberBet from "./NumberBet"
import ExternalBet from "./ExternalBet"
import "./RouletteBoard.css"

const RouletteBoard = () => {
  const { rouletteValues, updateBets, getChipsForCell } = useRoulette()
  const boardRef = useRef(null)

  const handleClick = useCallback(
    (e) => {
      const button = e.target.closest("button")
      if (!button) return

      if (boardRef.current) {
        boardRef.current.dataset.hovercell = ""
      }

      const item = JSON.parse(button.dataset.info)
      updateBets(item)
    },
    [updateBets],
  )

  const { numbers, externals } = useMemo(() => {
    return rouletteValues.reduce(
      (acc, cell) => {
        if (cell.type === "number") acc.numbers.push(cell)
        else acc.externals.push(cell)
        return acc
      },
      { numbers: [], externals: [] },
    )
  }, [rouletteValues])

  const onHover = useCallback((item) => {
    if (!boardRef.current) return
    boardRef.current.dataset.hovercell = item || ""
  }, [])

  return (
    <div
      ref={boardRef}
      className="
    roulette-board
    grid
      grid-cols-10 grid-rows-28
    sm:grid-cols-28 sm:grid-rows-10
    gap-1
    text-white"
      onClick={handleClick}
      onMouseLeave={() => {
        if (boardRef.current) {
          boardRef.current.dataset.hovercell = ""
        }
      }}>
      {numbers.map((cell) => (
        <NumberBet key={cell.text} item={cell}>
          <PlacedChips chips={getChipsForCell(cell)} />
        </NumberBet>
      ))}

      {externals.map((cell) => (
        <ExternalBet key={cell.text} item={cell} onHover={onHover}>
          <PlacedChips chips={getChipsForCell(cell)} />
        </ExternalBet>
      ))}
    </div>
  )
}

export default RouletteBoard
