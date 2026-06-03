import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import SlotPaytable from "../SlotPaytable"
import {
  IconCoinBitcoin,
  IconHourglass,
  IconListDetails,
  IconRotate360,
  IconTable,
  IconCancel,
} from "@tabler/icons-react"
import {
  GAME_ACTION_BUTTON_BASIS_CLASS,
  GAME_ACTION_BUTTON_FULL_CLASS,
} from "../../gameControlClasses"

const MAX_HISTORY_RESULTS = 15
const formatSignedAmount = (value) => {
  const amount = Number(value) || 0
  const absAmount = Math.abs(amount).toFixed(2)

  if (amount > 0) return `+${absAmount}`
  if (amount < 0) return `-${absAmount}`
  return absAmount
}

const SlotHistory = ({ spins, bet = 0, compact = false }) => {
  const { t } = useLocale()
  const recentSpins = spins.slice(-MAX_HISTORY_RESULTS)
  const numericBet = Number(bet) || 0
  const historyClassName = compact
    ? "flex flex-col gap-2 text-sm"
    : "hidden flex-col gap-3 text-sm lg:flex lg:text-base"
  const emptyHistoryClassName = compact
    ? "flex justify-between text-sm"
    : "hidden justify-between text-sm lg:flex lg:text-base"
  const rowClassName = compact
    ? "flex items-center justify-between gap-2"
    : "flex items-center justify-between gap-3"
  const iconClassName = compact ? "h-4 w-4" : "h-4 w-4 lg:h-5 lg:w-5"

  if (recentSpins.length === 0) {
    return (
      <div className={emptyHistoryClassName}>
        <span className="opacity-70">{t("games.slots.controls.history")}:</span>
        <span className="font-bold">0/{MAX_HISTORY_RESULTS}</span>
      </div>
    )
  }

  return (
    <div className={historyClassName}>
      <div className="flex justify-between">
        <span className="opacity-70">{t("games.slots.controls.history")}:</span>
      </div>

      <div className="flex flex-col gap-1">
        {recentSpins.map((spin, index) => {
          const spinNumber =
            spin.spinNumber ?? spins.length - recentSpins.length + index + 1
          const netAmount = spin.isWinner
            ? Number(spin.payout || 0)
            : -numericBet
          const amountClass =
            netAmount > 0
              ? "text-success"
              : netAmount < 0
                ? "text-error/80"
                : "text-base-content/70"

          return (
            <div key={`${spinNumber}-${index}`} className={rowClassName}>
              <span className="min-w-10 opacity-70">#{spinNumber}</span>
              <span
                className={`flex-1 truncate font-bold ${
                  spin.isWinner ? "text-success" : "text-error/80"
                }`}>
                {t(`games.result.${spin.isWinner ? "win" : "lose"}`)}
              </span>
              <span
                className={`flex items-center gap-1 font-bold ${amountClass}`}>
                {formatSignedAmount(netAmount)}
                <IconCoinBitcoin className={iconClassName} />
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SlotSessionSummary = ({ spins, bet = 0 }) => {
  const { t } = useLocale()
  const numericBet = Number(bet) || 0
  const totalOutcome = spins.reduce(
    (acc, spin) =>
      acc + (spin.isWinner ? Number(spin.payout || 0) : -numericBet),
    0,
  )
  const totalOutcomeClass =
    totalOutcome > 0
      ? "text-success"
      : totalOutcome < 0
        ? "text-error/80"
        : "text-base-content/70"

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between">
        <span className="opacity-70">{t("games.slots.controls.spins")}:</span>
        <span className="font-bold">{spins.length}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="opacity-70">
          {t("games.slots.controls.totalPayout")}:
        </span>
        <div
          className={`flex items-center gap-1 font-bold ${totalOutcomeClass}`}>
          <span>{formatSignedAmount(totalOutcome)}</span>
          <IconCoinBitcoin className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  )
}

const SlotActions = ({
  disabled,
  onSpin,
  onEndSession,
  theme = "starwars",
  spins = [],
  historySpins = spins,
  bet = 0,
  showSessionActions = true,
  showHistory = true,
}) => {
  const { t } = useLocale()
  const mobileActionsCols = showHistory ? "grid-cols-2" : "grid-cols-1"
  const mobileActionsGap = "gap-2 sm:gap-2"

  return (
    <>
      {showSessionActions && <SlotSessionSummary spins={spins} bet={bet} />}

      <div
        className={`grid w-full ${mobileActionsCols} ${mobileActionsGap} lg:hidden`}>
        <Button
          variant="neutral"
          className={GAME_ACTION_BUTTON_BASIS_CLASS}
          onClick={() =>
            document.getElementById("slot-paytable-modal")?.showModal()
          }
          disabled={disabled}
          svg={<IconTable />}>
          {t("games.slots.controls.paytable")}
        </Button>
        {showHistory && (
          <Button
            variant="neutral"
            className={GAME_ACTION_BUTTON_BASIS_CLASS}
            onClick={() =>
              document.getElementById("slot-history-modal")?.showModal()
            }
            disabled={disabled || historySpins.length === 0}
            svg={<IconListDetails />}>
            {t("games.slots.controls.history")}
          </Button>
        )}
      </div>

      {showSessionActions && (
        <>
          <div className="grid w-full grid-cols-1 gap-2 xl:grid-cols-2">
            <Button
              variant="secondary"
              className={`${GAME_ACTION_BUTTON_FULL_CLASS} text-lg font-bold`}
              onClick={onSpin}
              disabled={disabled}
              svg={disabled ? <IconHourglass /> : <IconRotate360 />}>
              {!disabled && t("games.slots.controls.spin")}
            </Button>

            <Button
              variant="primary"
              className={GAME_ACTION_BUTTON_FULL_CLASS}
              onClick={onEndSession}
              disabled={disabled}
              svg={<IconCancel />}>
              {t("games.slots.controls.endSession")}
            </Button>
          </div>

          <SlotHistory spins={historySpins} bet={bet} />
        </>
      )}

      {showHistory && (
        <dialog
          id="slot-history-modal"
          className="modal modal-bottom sm:modal-middle lg:hidden">
          <div className="modal-box">
            <h3 className="mb-4 text-center text-lg font-bold">
              {t("games.slots.controls.history")}
            </h3>
            <SlotHistory spins={historySpins} bet={bet} compact />
            <div className="modal-action">
              <form method="dialog" className="w-full">
                <Button
                  variant="neutral"
                  className={GAME_ACTION_BUTTON_FULL_CLASS}>
                  {t("ui.buttons.close")}
                </Button>
              </form>
            </div>
          </div>
        </dialog>
      )}

      <dialog
        id="slot-paytable-modal"
        className="modal modal-bottom sm:modal-middle lg:hidden">
        <div className="modal-box max-w-[calc(100vw-1rem)] overflow-x-hidden">
          <h3 className="mb-4 text-center text-lg font-bold">
            {t("games.slots.controls.paytable")}
          </h3>
          <SlotPaytable theme={theme} horizontal />
          <div className="modal-action">
            <form method="dialog" className="w-full">
              <Button
                variant="neutral"
                className={GAME_ACTION_BUTTON_FULL_CLASS}>
                {t("ui.buttons.close")}
              </Button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default SlotActions
