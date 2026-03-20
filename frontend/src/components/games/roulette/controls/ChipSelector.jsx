import React from "react"
import Chip from "../chips/Chip"
import { CHIPS } from "../rouletteConsts"

const ChipSelector = ({ selectedChip, setSelectedChip }) => {
    return (
        <div>
            <p className="fieldset-legend text-md">Chip value: {selectedChip}</p>
            <div className="flex flex-wrap gap-2 justify-center">
                {CHIPS.map((chip) => (
                    <div
                        key={chip.idSuffix}
                        onClick={() => setSelectedChip(chip.value)}
                        className={`cursor-pointer p-1 rounded-full border-2 ${
                            selectedChip === chip.value ? "border-yellow-400" : "border-transparent"
                        }`}
                    >
                        <Chip value={chip.value} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChipSelector
