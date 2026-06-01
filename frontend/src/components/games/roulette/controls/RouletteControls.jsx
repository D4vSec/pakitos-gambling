import React from "react"
import BettingInput from "../../BettingInput"
import ChipSelector from "./ChipSelector"
import { useRoulette } from "@/providers/RouletteProvider"
import { useNotification } from "@/providers/NotificationProvider"
import BettingBtns from "../../BettingBtns"
import { useLocale } from "@/providers/LocaleProvider"

const RouletteControls = () => {
  const {
    betAmount,
    updateBetAmount,
    selectedChip,
    updateChip,
    clearBets,
    repeatBets,
    doubleBets,
    game,
    spin,
    type,
  } = useRoulette()

  const { addNotification } = useNotification()

  const { t } = useLocale()

  const handleStartGame = () => {
    if (betAmount <= 0) {
      addNotification(t("message.error.bet0"), "error")
      return
    }
    console.log("g", game)
    addNotification(t("message.warning.spinning"), "warning", {
      duration: 2000,
    })

    spin()
  }

  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 sm:gap-1.5 sm:p-2 lg:gap-5 lg:p-4">
      <h2 className="text-center text-xl font-bold ">
        {t(`games.roulette.types.${type}`)}
      </h2>

      <BettingInput bet={{ betAmount, updateBetAmount }} readOnly />

      <BettingBtns
        actions={{
          repeat: repeatBets,
          clear: clearBets,
          double: doubleBets,
          start: handleStartGame,
        }}
        compact></BettingBtns>

      <ChipSelector selectedChip={selectedChip} setSelectedChip={updateChip} />
    </div>
  )
}

export default RouletteControls
