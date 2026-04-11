import React from "react"
import BoardPiece from "./BoardPiece"
import { useRoulette } from "@/providers/RouletteProvider"
import PlacedChips from "../chips/PlacedChips"
import "./RouletteBoard.css"

const RouletteBoard = () => {
    const { getRouletteValues, updateBets, getChipsForCell } = useRoulette()

    const values = getRouletteValues()

    const handleClick = (e) => {
        if (e.target.tagName !== "BUTTON") return
        updateBets(JSON.parse(e.target.dataset.info))
    }

    return (
        <div
            className="grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(28,1fr)] md:grid-cols-[repeat(28,1fr)] md:grid-rows-[repeat(10,1fr)] gap-1 w-full h-full text-black "
            onClick={(e) => handleClick(e)}
        >
            {values.map((cell) => (
                <BoardPiece key={cell.text} item={cell}>
                    <PlacedChips chips={getChipsForCell(cell)} />
                </BoardPiece>
            ))}
        </div>
    )
}

export default RouletteBoard
