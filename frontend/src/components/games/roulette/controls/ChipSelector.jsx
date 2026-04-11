import React from "react"
import Chip from "../chips/Chip"
import { CHIPS } from "../rouletteConsts"
import { useLocale } from "@/providers/LocaleProvider"

const ChipSelector = ({ selectedChip, setSelectedChip }) => {
    const { t } = useLocale()

    return (
        <div>
            <p className="fieldset-legend text-md">
                {t("games.roulette.controls.chipValue")}: {selectedChip}
            </p>
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
