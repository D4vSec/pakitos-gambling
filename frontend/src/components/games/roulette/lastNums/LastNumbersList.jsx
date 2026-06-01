import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import LastNumber from "./LastNumber"
import { useLocale } from "@/providers/LocaleProvider"

const LastNumbersList = ({ compact = false, vertical = false }) => {
  const { winningNums, rouletteValues } = useRoulette()
  const { t } = useLocale()
  const last4Objects = winningNums
    .slice(0, 4)
    .map((num) => rouletteValues.find((i) => i.bet === num))
    .filter(Boolean)

  return (
    <div className="flex flex-col items-center justify-center gap-2 lg:gap-3">
      <h2
        className={`text-center text-xl font-bold leading-tight ${
          compact ? "max-w-[8ch]" : "max-w-none"
        }`}>
        {t("games.roulette.lastNumbers")}
      </h2>
      {last4Objects.length ? (
        <div
          className={`flex items-center justify-center gap-2 ${
            vertical ? "flex-col" : "flex-row"
          }`}>
          {last4Objects.map((item, index) => (
            <LastNumber key={index} number={item.text} />
          ))}
        </div>
      ) : (
        <LastNumber number={true} />
      )}
    </div>
  )
}

export default LastNumbersList
