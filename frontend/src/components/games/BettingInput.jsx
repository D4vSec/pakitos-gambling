import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const BettingInput = ({ bet, readOnly }) => {
  const { betAmount, updateBetAmount } = bet
  const { t } = useLocale()
  return (
    <div className="flex flex-col items-baseline gap-1 md:flex-row">
      <div className="flex w-full flex-row items-center gap-2 md:flex-col md:items-stretch md:gap-1">
        <p className="fieldset-legend shrink-0 text-sm sm:text-md">
          {t("games.betAmount.label")}:
        </p>
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
          className="input input-md h-8 min-h-8 min-w-0 flex-1  md:h-auto md:w-full"
        />
      </div>
    </div>
  )
}

export default BettingInput
