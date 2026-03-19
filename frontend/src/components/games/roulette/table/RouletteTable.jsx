import React from "react"
import TablePart from "./TablePart"
import { useRoulette } from "@/providers/RouletteProvider"
import PlacedChips from "../chips/PlacedChips"

import "./RouletteTable.css"

const RouletteTable = () => {
    const { getRouletteValues, type, updateBets, getChipsForCell } = useRoulette()
    const values = getRouletteValues(type)

    const handleClick = (e) => {
        if (e.target.tagName !== "BUTTON") return
        updateBets(JSON.parse(e.target.dataset.info))
    }

    return (
        <div className="col-span-3 w-full h-full">
            <div
                className="grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(28,1fr)] md:grid-cols-[repeat(28,1fr)] md:grid-rows-[repeat(10,1fr)] gap-1 w-full h-full text-black z-10 "
                onClick={(e) => handleClick(e)}
            >
                {values.map((cell) => (
                    <TablePart key={cell.text} text={cell.text} rouletteType={type}>
                        <PlacedChips chips={getChipsForCell(cell)} />
                    </TablePart>
                ))}
            </div>
        </div>
    )
}

export default RouletteTable
