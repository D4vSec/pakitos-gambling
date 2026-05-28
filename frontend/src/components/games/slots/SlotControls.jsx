import React, { useRef, useState } from "react"
import { useSlots } from "@/providers/SlotsProvider"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "@/components/buttons/Button"
import BitcoinSVG from "@/components/svg/pictures/BitcoinSVG"
import { getAnimTotalMs, DIMS_BY_TYPE } from "./slotConstants"
import HourGlassSVG from "@/components/svg/pictures/HourGlassSVG"
import PlaySVG from "@/components/svg/actions/PlaySVG"

const NOTIF_DURATION = 1000

const SLOT_TYPES = ["3x3", "3x5", "5x5"]

const SlotControls = ({ type = "3x3", onTypeChange }) => {
  const dims = DIMS_BY_TYPE[type] ?? { rows: 3, cols: 3 }
  const NOTIF_DELAY_MS = getAnimTotalMs(dims.cols, dims.rows)
  const { session, spins, loading, createSession, spin, endSession } = useSlots()
  const { user, setUser } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const [betAmount, setBetAmount] = useState("")
  const [lastBet, setLastBet] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const animTimerRef = useRef(null)

  const balance = parseFloat(user?.balance) || 0
  const totalPayout = spins.reduce((acc, s) => acc + (s.payout ?? 0), 0)
  const isActive = !!session
  const isBusy = loading || isAnimating

  const scheduleAnimEnd = () => {
    clearTimeout(animTimerRef.current)
    animTimerRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, NOTIF_DELAY_MS)
  }

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
    setIsAnimating(true)

    try {
      const sessionRes = await createSession({ type, amount })
      // Use gameId directly from response — state update is async and not ready yet
      const result = await spin(sessionRes.gameId)
      scheduleAnimEnd()
      setTimeout(() => {
        addNotification(
          t(`games.result.${result.isWinner ? "win" : "lose"}`),
          result.isWinner ? "success" : "error",
          {
            scope: "games",
            duration: NOTIF_DURATION,
            payout: result.isWinner ? result.payout : 0,
          },
        )
      }, NOTIF_DELAY_MS)
      setTimeout(() => {
        if (result.balance != null)
          setUser((prev) => ({
            ...prev,
            balance: Number(result.balance).toFixed(2),
          }))
      }, NOTIF_DELAY_MS + NOTIF_DURATION)
    } catch {
      setIsAnimating(false)
      clearTimeout(animTimerRef.current)
    }
  }

  const handleSpin = async () => {
    if (!session?.gameId) return
    setIsAnimating(true)
    const result = await spin(session.gameId).catch(() => null)
    if (!result) {
      setIsAnimating(false)
      return
    }

    scheduleAnimEnd()
    setTimeout(() => {
      addNotification(
        t(`games.result.${result.isWinner ? "win" : "lose"}`),
        result.isWinner ? "success" : "error",
        {
          scope: "games",
          duration: NOTIF_DURATION,
          payout: result.isWinner ? result.payout : 0,
        },
      )
    }, NOTIF_DELAY_MS)
    setTimeout(() => {
      if (result.balance != null)
        setUser((prev) => ({
          ...prev,
          balance: Number(result.balance).toFixed(2),
        }))
    }, NOTIF_DELAY_MS + NOTIF_DURATION)
  }

  const handleEnd = async () => {
    if (!session?.gameId) return
    await endSession(session.gameId)
    setBetAmount("")
    setLastBet("")
  }

  return (
    <div className="flex flex-col gap-5 w-full h-full p-4">
      <h2 className="font-bold text-xl text-center">{t(`games.slots.modes.${type}`)}</h2>

      {!isActive && (
        <>
          <div className="flex flex-col gap-1">
            <p className="fieldset-legend text-md">{t("games.slots.controls.selectType")}:</p>
            <div className="flex gap-2">
              {SLOT_TYPES.map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  variant={type === mode ? "primary" : "ghost"}
                  size="sm"
                  className={`flex-1 ${type === mode ? "" : "border border-base-content/20"}`}
                  onClick={() => onTypeChange?.(mode)}
                  disabled={isBusy}>
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="fieldset-legend text-md">{t("games.betAmount.label")}:</p>
            <input
              type="number"
              placeholder={t("games.betAmount.placeholder")}
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
              disabled={isBusy || !lastBet}
            >
              {t("games.actions.repeatBet")}
            </Button>
            <Button
              variant="primary"
              className="flex-1 basis-0 min-w-fit"
              onClick={() => setBetAmount((prev) => String((parseFloat(prev || 0) * 2).toFixed(2)))}
              disabled={isBusy || !betAmount}
            >
              {t("games.actions.doubleBet")}
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setBetAmount("")}
              disabled={isBusy}
            >
              {t("games.actions.clearBet")}
            </Button>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleStart}
            disabled={isBusy || !betAmount}
            svg={isBusy ? <HourGlassSVG /> : <PlaySVG />}
          >
            {!isBusy && t("games.slots.controls.spin")}
          </Button>
        </>
      )}

      {isActive && (
        <>
          <div className="flex flex-col gap-1">
            <p className="fieldset-legend text-md opacity-70">{t("games.betAmount.label")}:</p>
            <div className="flex items-center gap-1 font-bold text-base">
              <span>{session.bet}</span>
              <BitcoinSVG />
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full text-lg font-bold"
            onClick={handleSpin}
            disabled={isBusy}
            svg={isBusy ? <HourGlassSVG /> : <PlaySVG />}
          >
            {!isBusy && t("games.slots.controls.spin")}
          </Button>

          <div className="divider my-0" />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-70">{t("games.slots.controls.spins")}:</span>
              <span className="font-bold">{spins.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">{t("games.slots.controls.totalPayout")}:</span>
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
            disabled={isBusy}
          >
            {t("games.slots.controls.endSession")}
          </Button>
        </>
      )}
    </div>
  )
}

export default SlotControls
