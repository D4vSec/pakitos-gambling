import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const BettingInput = ({ bet, readOnly }) => {
    const { betAmount, updateBetAmount } = bet
    const { t } = useLocale()
    return (
        <div className="flex flex-col md:flex-row items-baseline gap-1">
            <div className="flex flex-col gap-1 w-full">
                <p className="fieldset-legend text-md">{t("games.roulette.controls.betAmount")}:</p>
                <input
                    type="number"
                    placeholder={t("games.roulette.controls.betAmountPlaceholder")}
                    name="betAmount"
                    value={betAmount}
                    readOnly={readOnly || false}
                    onChange={(e) => updateBetAmount(Number(e.target.value))}
                    className="input w-full"
                />
            </div>
        </div>
    )
}

export default BettingInput
