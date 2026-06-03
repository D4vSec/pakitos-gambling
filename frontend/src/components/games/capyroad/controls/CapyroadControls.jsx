import React from "react"
import BettingInput from "../../BettingInput"
import BettingBtns from "../../BettingBtns"
import { useCapyroad } from "@/providers/CapyroadProvider"
import CapyroadActions from "./CapyroadActions"
import { useLocale } from "@/providers/LocaleProvider"

const CapyroadControls = () => {
  const {
    betAmount,
    updateBetAmount,
    repeatBet,
    doubleBet,
    clearBet,
    game,
    startGame,
    jumpRoad,
    stand,
    isActionPending,
    isOutcomeAnimationRunning,
  } = useCapyroad()
  const { t } = useLocale()

  const disabled = game?.status !== "ongoing"
  const isBettingDisabled = !disabled || isOutcomeAnimationRunning

  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 sm:gap-1.5 sm:p-2 lg:gap-5 lg:p-4">
      <h2 className="m-0 p-0 text-center text-xl font-bold">{t("games.capyroad.title")}</h2>

      <BettingInput bet={{ betAmount, updateBetAmount }} readOnly={isBettingDisabled} />

      <BettingBtns
        actions={{
          repeat: repeatBet,
          double: doubleBet,
          clear: clearBet,
          start: startGame,
        }}
        disabled={isBettingDisabled}>
        <CapyroadActions
          disabled={disabled || isActionPending || isOutcomeAnimationRunning}
          canCashout={Number(game?.info?.road || 0) > 0}
          onCross={jumpRoad}
          onCashout={stand}
        />
      </BettingBtns>
    </div>
  )
}

export default CapyroadControls
