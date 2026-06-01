import React, { useMemo, useRef, useCallback } from "react"
import { useRoulette } from "@/providers/rouletteContext"
import PlacedChips from "../chips/PlacedChips"
import NumberBet from "./NumberBet"
import ExternalBet from "./ExternalBet"
import "./RouletteBoard.css"

const getCellId = (cell) => `${cell.type}-${cell.bet}`

const RouletteBoard = () => {
  const { rouletteValues, updateBets, getChipsForCell } = useRoulette()
  const boardRef = useRef(null)

  const cellById = useMemo(() => {
    return new Map(rouletteValues.map((cell) => [getCellId(cell), cell]))
  }, [rouletteValues])

  const handleClick = useCallback(
    (e) => {
      const button = e.target.closest("button")
      if (!button) return

      if (boardRef.current) {
        boardRef.current.dataset.hovercell = ""
      }

      const item = cellById.get(button.dataset.cellId)
      if (!item) return

      updateBets(item)
    },
    [cellById, updateBets],
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
        <NumberBet key={cell.text} item={cell} cellId={getCellId(cell)}>
          <PlacedChips chips={getChipsForCell(cell)} />
        </NumberBet>
      ))}

      {externals.map((cell) => (
        <ExternalBet
          key={cell.text}
          item={cell}
          cellId={getCellId(cell)}
          onHover={onHover}>
          <PlacedChips chips={getChipsForCell(cell)} />
        </ExternalBet>
      ))}
    </div>
  )
}

export default RouletteBoard
