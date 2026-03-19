import React from "react"
import Chip from "./Chip"

const PlacedChips = ({ chips }) => {
    const offsetY = 4
    const offsetX = 12
    const maxPerColumn = 10

    // Dividir fichas en columnas
    const columns = []
    for (let i = 0; i < chips.length; i += maxPerColumn) {
        columns.push(chips.slice(i, i + maxPerColumn))
    }

    // Calcular desplazamiento para centrar todas las columnas
    const totalColumnsWidth = (columns.length - 1) * offsetX
    const startOffset = -totalColumnsWidth / 2 // mover la primera columna a la izquierda

    return (
        <div className="relative w-full h-full flex items-end justify-center pointer-events-none">
            {columns.map((column, colIndex) => (
                <div
                    key={colIndex}
                    className="absolute bottom-0 flex flex-col items-center"
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
