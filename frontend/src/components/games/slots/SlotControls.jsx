import React, { useState } from "react"
import { useSlots } from "@/providers/SlotsProvider"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "@/components/buttons/Button"
import BitcoinSVG from "@/components/svg/BitcoinSVG"

// Must match STOP_DELAYS last value (700) + SlotReel landing timeout (550)
const NOTIF_DELAY_MS = 700 + 550

const SlotControls = ({ type = "3x3" }) => {
  const { session, spins, loading, createSession, spin, endSession } = useSlots()
  const { user } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const [betAmount, setBetAmount] = useState("")
  const [lastBet, setLastBet] = useState("")

  const balance = parseFloat(user?.balance) || 0
  const totalPayout = spins.reduce((acc, s) => acc + (s.payout ?? 0), 0)
  const isActive = !!session

  const handleStart = async () => {
    const amount = parseFloat(betAmount)
    if (!amount || amount <= 0) {
      addNotification(t("message.error.bet0"), "error")
      return
    }
    if (amount > balance) {
      addNotification(t("message.error.INSUFFICIENT_BALANCE"), "error")
      return
    }
    setLastBet(betAmount)

    try {
      const sessionRes = await createSession({ type, amount })
      // Use gameId directly from response — state update is async and not ready yet
      const result = await spin(sessionRes.gameId)
      setTimeout(() => {
        addNotification(
          t(`games.result.${result.isWinner ? "win" : "lose"}`),
          result.isWinner ? "success" : "error",
          { scope: "games", duration: 2500, payout: result.isWinner ? result.payout : 0 },
        )
      }, NOTIF_DELAY_MS)
    } catch {
      // errors already handled inside provider
    }
  }

  const handleSpin = async () => {
    if (!session?.gameId) return
    const result = await spin(session.gameId).catch(() => null)
    if (!result) return

    setTimeout(() => {
      addNotification(
        t(`games.result.${result.isWinner ? "win" : "lose"}`),
        result.isWinner ? "success" : "error",
        { scope: "games", duration: 2500, payout: result.isWinner ? result.payout : 0 },
      )
    }, NOTIF_DELAY_MS)
  }

  const handleEnd = async () => {
    if (!session?.gameId) return
    await endSession(session.gameId)
    setBetAmount("")
    setLastBet("")
  }

  return (
    <div className="flex flex-col gap-5 w-full h-full p-4">
      <h2 className="font-bold text-xl text-center">
        {t(`games.slots.${type}`)}
      </h2>

      {!isActive && (
        <>
          <div className="flex flex-col gap-1">
            <p className="fieldset-legend text-md">
              {t("games.slots.controls.betAmount")}:
            </p>
            <input
              type="number"
              placeholder={t("games.slots.controls.betAmountPlaceholder")}
              value={betAmount}
              min={0}
              step={0.01}
              onChange={(e) => {
                const val = e.target.value
                if (val === "") {
                  setBetAmount("")
                  return
                }
                setBetAmount(Number(parseFloat(val).toFixed(2)))
              }}
              className="input w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              className="flex-1 basis-0 min-w-fit"
              onClick={() => lastBet && setBetAmount(lastBet)}
              disabled={loading || !lastBet}
            >
              {t("games.actions.repeatBet")}
            </Button>
            <Button
              variant="primary"
              className="flex-1 basis-0 min-w-fit"
              onClick={() =>
                setBetAmount((prev) =>
                  String((parseFloat(prev || 0) * 2).toFixed(2)),
                )
              }
              disabled={loading || !betAmount}
            >
              {t("games.actions.doubleBet")}
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setBetAmount("")}
              disabled={loading}
            >
              {t("games.actions.clearBet")}
            </Button>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleStart}
            disabled={loading || !betAmount}
          >
            {loading ? "⏳" : `🎰 ${t("games.slots.controls.spin")}`}
          </Button>
        </>
      )}

      {isActive && (
        <>
          <div className="flex flex-col gap-1">
            <p className="fieldset-legend text-md opacity-70">
              {t("games.slots.controls.betAmount")}:
            </p>
            <div className="flex items-center gap-1 font-bold text-base">
              <span>{session.bet}</span>
              <BitcoinSVG />
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full text-lg font-bold"
            onClick={handleSpin}
            disabled={loading}
          >
            {loading ? "⏳" : `🎰 ${t("games.slots.controls.spin")}`}
          </Button>

          <div className="divider my-0" />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-70">{t("games.slots.controls.spins")}:</span>
              <span className="font-bold">{spins.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">
                {t("games.slots.controls.totalPayout")}:
              </span>
              <div className="flex items-center gap-1 font-bold">
                <span>{totalPayout.toFixed(2)}</span>
                <BitcoinSVG />
              </div>
            </div>
          </div>

          <Button
            variant="error"
            size="sm"
            className="w-full mt-auto"
            onClick={handleEnd}
            disabled={loading}
          >
            {t("games.slots.controls.endSession")}
          </Button>
        </>
      )}
    </div>
  )
}

export default SlotControls
