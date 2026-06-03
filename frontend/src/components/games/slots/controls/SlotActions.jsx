import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import SlotPaytable from "../SlotPaytable"
import {
  IconCoinBitcoin,
  IconHourglass,
  IconListDetails,
  IconPlayerPlay,
  IconTable,
} from "@tabler/icons-react"

const MAX_HISTORY_RESULTS = 10

const SlotHistory = ({ spins, compact = false }) => {
  const { t } = useLocale()
  const recentSpins = spins.slice(-MAX_HISTORY_RESULTS)

  if (recentSpins.length === 0) {
    return (
      <div
        className={`flex justify-between text-sm ${
          compact ? "" : "hidden lg:flex"
        }`}>
        <span className="opacity-70">{t("games.slots.controls.history")}:</span>
        <span className="font-bold">0/{MAX_HISTORY_RESULTS}</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 text-sm ${compact ? "" : "hidden lg:flex"}`}>
      <div className="flex justify-between">
        <span className="opacity-70">{t("games.slots.controls.history")}:</span>
        <span className="font-bold">
          {recentSpins.length}/{MAX_HISTORY_RESULTS}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {recentSpins.map((spin, index) => {
          const spinNumber =
            spin.spinNumber ?? spins.length - recentSpins.length + index + 1
          const payout = Number(spin.payout || 0).toFixed(2)

          return (
            <div
              key={`${spinNumber}-${index}`}
              className="flex items-center justify-between gap-2">
              <span className="min-w-10 opacity-70">#{spinNumber}</span>
              <span
                className={`flex-1 truncate font-bold ${
                  spin.isWinner ? "text-success" : "text-error/80"
                }`}>
                {t(`games.result.${spin.isWinner ? "win" : "lose"}`)}
              </span>
              <span className="flex items-center gap-1 font-bold">
                {payout}
                <IconCoinBitcoin className="h-4 w-4" />
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SlotActions = ({
  children,
  disabled,
  onSpin,
  onEndSession,
  theme = "starwars",
  spins = [],
  showSessionActions = true,
  showHistory = true,
}) => {
  const { t } = useLocale()
  const mobileActionsCols = showHistory ? "grid-cols-2" : "grid-cols-1"

  return (
    <>
      {children}

      <div className={`grid ${mobileActionsCols} gap-2 lg:hidden`}>
        <Button
          variant="neutral"
          size="sm"
          onClick={() =>
            document.getElementById("slot-paytable-modal")?.showModal()
          }
          svg={<IconTable />}>
          {t("games.slots.controls.paytable")}
        </Button>
        {showHistory && (
          <Button
            variant="neutral"
            size="sm"
            onClick={() =>
              document.getElementById("slot-history-modal")?.showModal()
            }
            disabled={spins.length === 0}
            svg={<IconListDetails />}>
            {t("games.slots.controls.history")}
          </Button>
        )}
      </div>

      {showSessionActions && (
        <>
          <Button
            variant="secondary"
            className="w-full text-lg font-bold"
            onClick={onSpin}
            disabled={disabled}
            svg={disabled ? <IconHourglass /> : <IconPlayerPlay />}>
            {!disabled && t("games.slots.controls.spin")}
          </Button>

          <Button
            variant="primary"
            size="md"
            className="w-full mt-auto"
            onClick={onEndSession}
            disabled={disabled}>
            {t("games.slots.controls.endSession")}
          </Button>

          <SlotHistory spins={spins} />
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
            <SlotHistory spins={spins} compact />
            <div className="modal-action">
              <form method="dialog" className="w-full">
                <Button variant="neutral" className="w-full">
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
              <Button variant="neutral" className="w-full">
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
