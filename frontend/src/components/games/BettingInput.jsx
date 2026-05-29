import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const BettingInput = ({ bet, readOnly }) => {
  const { betAmount, updateBetAmount } = bet
  const { t } = useLocale()
  return (
    <div className="flex flex-col md:flex-row items-baseline gap-1">
      <div className="flex flex-col gap-1 w-full">
        <p className="fieldset-legend text-md ">{t("games.betAmount.label")}:</p>
        <input
          type="number"
          placeholder={t("games.betAmount.placeholder")}
          name="betAmount"
          value={betAmount ?? ""}
          readOnly={readOnly || false}
          min={0}
          step={0.01}
          onChange={(e) => {
            const value = e.target.value
            if (value === "") {
              updateBetAmount("")
              return
            }
            const parsed = Number(value)
            updateBetAmount(Number(parsed.toFixed(2)))
          }}
          className="input w-full"
        />
      </div>
    </div>
  )
}

export default BettingInput
