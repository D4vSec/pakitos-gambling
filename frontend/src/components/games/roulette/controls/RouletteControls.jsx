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

    setTimeout(() => {
      spin()
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4">
      <h2 className="font-bold text-xl text-center">
        {t(`games.roulette.${type}`)}
      </h2>

      <BettingInput bet={{ betAmount, updateBetAmount }} readOnly />

      <BettingBtns
        actions={{
          repeat: repeatBets,
          clear: clearBets,
          double: doubleBets,
          start: handleStartGame,
        }}></BettingBtns>

      <ChipSelector selectedChip={selectedChip} setSelectedChip={updateChip} />
    </div>
  )
}

export default RouletteControls
