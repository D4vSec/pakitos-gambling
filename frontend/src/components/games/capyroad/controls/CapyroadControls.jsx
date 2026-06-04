 import React from "react"
import BettingInput from "../../BettingInput"
import BettingBtns from "../../BettingBtns"
import { useCapyroad } from "@/providers/CapyroadProvider"
import CapyroadActions from "./CapyroadActions"
import { useLocale } from "@/providers/LocaleProvider"
import {
  IconAlertTriangle,
  IconCoinBitcoin,
  IconRoad,
} from "@tabler/icons-react"

const CapyroadStats = ({ game }) => {
  const { t } = useLocale()
  const currentRoad = Number(game?.info?.road || 0)
  const payoutMultiplier = Number(game?.info?.payoutMultiplier || 1)
  const payout = Number(game?.payout || 0)
  const crashProbability = Number(game?.info?.crashProbability || 0)
  const isCrashed = Boolean(game?.info?.isCrashed)
  const riskClassName = isCrashed
    ? "text-error"
    : crashProbability <= 20
      ? "text-success"
      : crashProbability <= 40
        ? "text-yellow-400"
        : crashProbability <= 60
          ? "text-orange-400"
          : crashProbability <= 80
            ? "text-red-400"
            : "text-error"

  return (
    <div className="grid grid-cols-1 gap-2 rounded-md border border-base-300 bg-base-200/70 p-3 text-sm ">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 opacity-70">
          <IconRoad className="h-4 w-4" />
          {t("games.capyroad.board.currentRoad")}:
        </span>
        <span className="font-bold">{currentRoad + 1}</span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 opacity-70">
          <IconCoinBitcoin className="h-4 w-4" />
          {t("games.capyroad.board.payout")}:
        </span>
        <span className="font-bold">
          {payoutMultiplier.toFixed(2)}x / {payout.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 opacity-70">
          <IconAlertTriangle className="h-4 w-4" />
          {t("games.capyroad.board.crashChance")}:
        </span>
        <span className={`font-bold ${riskClassName}`}>
          {crashProbability}%
        </span>
      </div>
    </div>
  )
}

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

  const hasActiveGame = Boolean(game?.gameId)
  const hasOngoingGame = game?.status === "ongoing"
  const isBettingDisabled = hasActiveGame || isOutcomeAnimationRunning

  const handleStartGame = () => {
    if (isBettingDisabled) return
    startGame()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleStartGame()
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-2 sm:p-2 lg:gap-5 lg:p-4">
      <h2 className="m-0 p-0 text-center text-xl font-bold">
        {t("games.capyroad.title")}
      </h2>

      <form className="flex flex-col gap-2 lg:gap-4" onSubmit={handleSubmit}>
        <BettingInput
          bet={{ betAmount, updateBetAmount }}
          readOnly={isBettingDisabled}
        />

        {hasActiveGame ? (
          <>
            <CapyroadStats game={game} />

            <CapyroadActions
              disabled={
                !hasOngoingGame || isActionPending || isOutcomeAnimationRunning
              }
              canCashout={Number(game?.info?.road || 0) > 0}
              onCross={jumpRoad}
              onCashout={stand}
            />
          </>
        ) : (
          <BettingBtns
            actions={{
              repeat: repeatBet,
              double: doubleBet,
              clear: clearBet,
              start: handleStartGame,
            }}
            disabled={isBettingDisabled}
          />
        )}
      </form>
    </div>
  )
}

export default CapyroadControls
