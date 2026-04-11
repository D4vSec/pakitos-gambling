import React from "react"
import { useRoulette } from "@/providers/RouletteProvider"
import LastNumber from "./LastNumber"
import { useLocale } from "@/providers/LocaleProvider"
const LastNumbersList = () => {
    const { winningNums, getRouletteValues } = useRoulette()
    const { t } = useLocale()
    const last4Objects = winningNums
        .slice(0, 4)
        .map((num) => getRouletteValues().find((i) => i.bet === num))
        .filter(Boolean)

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <h2 className="font-bold text-2xl">{t("games.roulette.lastNumbers")}</h2>
            {last4Objects.length ? (
                <div className="flex flex-row  justify-center items-center gap-2">
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
