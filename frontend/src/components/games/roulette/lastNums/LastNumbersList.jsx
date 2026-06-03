import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import LastNumber from "./LastNumber"
import { useLocale } from "@/providers/LocaleProvider"

const LastNumbersList = ({ compact = false, vertical = false }) => {
  const { winningNums } = useRoulette()
  const { t } = useLocale()
  const last4Numbers = winningNums.slice(0, 4)

  return (
    <div className="flex flex-col items-center justify-center gap-2 lg:gap-3">
      <h2
        className={`text-center text-xl font-bold leading-tight ${
          compact ? "max-w-[8ch]" : "max-w-none"
        }`}>
        {t("games.roulette.lastNumbers")}
      </h2>
      {last4Numbers.length ? (
        <div
          className={`flex items-center justify-center gap-2 ${
            vertical ? "flex-col" : "flex-row"
          }`}>
          {last4Numbers.map((number, index) => (
            <LastNumber key={index} number={number} />
          ))}
        </div>
      ) : (
        <LastNumber number={true} />
      )}
    </div>
  )
}

export default LastNumbersList
