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

  const hasOngoingGame = game?.status === "ongoing"
  const disabled = !hasOngoingGame
  const isBettingDisabled = !disabled || isOutcomeAnimationRunning

  const handleStartGame = () => {
    if (isBettingDisabled) return
    startGame()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleStartGame()
  }

  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 sm:gap-1.5 sm:p-2 lg:gap-5 lg:p-4">
      <h2 className="m-0 p-0 text-center text-xl font-bold">
        {t("games.capyroad.title")}
      </h2>

      <form
        className="mt-4 flex flex-col gap-2 lg:hidden"
        onSubmit={handleSubmit}>
        <BettingInput
          bet={{ betAmount, updateBetAmount }}
          readOnly={isBettingDisabled}
        />

        {hasOngoingGame ? (
          <CapyroadActions
            disabled={isActionPending || isOutcomeAnimationRunning}
            canCashout={Number(game?.info?.road || 0) > 0}
            onCross={jumpRoad}
            onCashout={stand}
          />
        ) : (
          <BettingBtns
            actions={{
              repeat: repeatBet,
              double: doubleBet,
              clear: clearBet,
              start: handleStartGame,
            }}
            disabled={false}
          />
        )}
      </form>

      <form
        className="hidden lg:flex lg:flex-col lg:gap-4"
        onSubmit={handleSubmit}>
        <BettingInput
          bet={{ betAmount, updateBetAmount }}
          readOnly={isBettingDisabled}
        />

        <BettingBtns
          actions={{
            repeat: repeatBet,
            double: doubleBet,
            clear: clearBet,
            start: handleStartGame,
          }}
          disabled={isBettingDisabled}>
          <CapyroadActions
            disabled={disabled || isActionPending || isOutcomeAnimationRunning}
            canCashout={Number(game?.info?.road || 0) > 0}
            onCross={jumpRoad}
            onCashout={stand}
          />
        </BettingBtns>
      </form>
    </div>
  )
}

export default CapyroadControls
