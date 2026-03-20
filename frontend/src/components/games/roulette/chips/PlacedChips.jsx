import React from "react"
import Chip from "./Chip"

const PlacedChips = ({ chips }) => {
    const offsetY = 5
    const offsetX = 15
    const maxPerColumn = 10

    const columns = []
    for (let i = 0; i < chips.length; i += maxPerColumn) {
        columns.push(chips.slice(i, i + maxPerColumn))
    }

    const totalColumnsWidth = (columns.length - 1) * offsetX
    const startOffset = -totalColumnsWidth / 2

    return (
        <div className="relative w-full h-full flex items-end justify-center pointer-events-none">
            {columns.map((column, colIndex) => (
                <div
                    key={colIndex}
                    className="absolute bottom-1/10 flex flex-col items-center"
                    style={{
                        left: `calc(50% + ${startOffset + colIndex * offsetX}px)`,
                        transform: "translateX(-50%)",
                    }}
                >
                    {column.map((chip, index) => (
                        <div
                            key={index}
                            className="absolute"
                            style={{
                                bottom: `${index * offsetY}px`,
                                zIndex: index,
                            }}
                        >
                            <Chip value={chip.value} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default PlacedChips
