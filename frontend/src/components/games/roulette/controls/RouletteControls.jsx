import React from "react"
import BettingInput from "../../BettingInput"
import ChipSelector from "./ChipSelector"
import { useRoulette } from "@/providers/RouletteProvider"
import { useNotification } from "@/providers/NotificationProvider"
import BettingBtns from "../../BettingBtns"
import { useLocale } from "@/providers/LocaleProvider"
import { IconHourglass, IconRotate360 } from "@tabler/icons-react"

const RouletteControls = () => {
  const {
    betAmount,
    updateBetAmount,
    selectedChip,
    updateChip,
    clearBets,
    repeatBets,
    doubleBets,
    spin,
    isSpinning,
    showSpinView,
    type,
  } = useRoulette()

  const { addNotification } = useNotification()

  const { t } = useLocale()
  const isBusy = isSpinning || showSpinView

  const handleStartGame = () => {
    if (isBusy) return

    if (betAmount <= 0) {
      addNotification(t("message.error.bet0"), "error")
      return
    }
    addNotification(t("message.warning.spinning"), "warning", {
      duration: 2000,
    })

    spin()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleStartGame()
  }

  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 sm:gap-1.5 sm:p-2 lg:gap-5 lg:p-4">
      <h2 className="text-center text-xl font-bold ">
        {t(`games.roulette.types.${type}`)}
      </h2>

      <form className="flex flex-col gap-1.5" onSubmit={handleSubmit}>
        <BettingInput bet={{ betAmount, updateBetAmount }} readOnly />

        <BettingBtns
          actions={{
            repeat: repeatBets,
            clear: clearBets,
            double: doubleBets,
            start: handleStartGame,
            startLabel: "games.slots.controls.spin",
            startSvg: isBusy ? <IconHourglass /> : <IconRotate360 />,
          }}
          disabled={isBusy}></BettingBtns>
      </form>

      <ChipSelector
        selectedChip={selectedChip}
        setSelectedChip={updateChip}
        disabled={isBusy}
      />
    </div>
  )
}

export default RouletteControls
