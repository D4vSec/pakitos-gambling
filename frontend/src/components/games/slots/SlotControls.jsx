import React, { useEffect, useRef, useState } from "react"
import { useSlots } from "@/providers/SlotsProvider"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import BettingInput from "@/components/games/BettingInput"
import BettingBtns from "@/components/games/BettingBtns"
import SlotActions from "./controls/SlotActions"
import SlotTypeSelector from "./controls/SlotTypeSelector"
import { IconHourglass, IconRotate360 } from "@tabler/icons-react"
import { getAnimTotalMs, DIMS_BY_TYPE } from "./slotConstants"

const NOTIF_DURATION = 2000

const SlotControls = ({ type = "3x3", theme = "starwars", onTypeChange }) => {
  const dims = DIMS_BY_TYPE[type] ?? { rows: 3, cols: 3 }
  const NOTIF_DELAY_MS = getAnimTotalMs(dims.cols, dims.rows)
  const { session, spins, loading, createSession, spin, endSession } =
    useSlots()
  const { user, setUser } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const [betAmount, setBetAmount] = useState("")
  const [lastBet, setLastBet] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [visibleHistorySpins, setVisibleHistorySpins] = useState([])
  const animTimerRef = useRef(null)

  const balance = parseFloat(user?.balance) || 0
  const isActive = !!session
  const isBusy = loading || isAnimating
  const displayedBetAmount = isActive ? session.bet : betAmount
  const displayedSpins = isAnimating ? visibleHistorySpins : spins

  const scheduleAnimEnd = () => {
    clearTimeout(animTimerRef.current)
    animTimerRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, NOTIF_DELAY_MS)
  }

  const handleStart = async () => {
    if (isBusy) return

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
    setVisibleHistorySpins([])
    setIsAnimating(true)

    try {
      const sessionRes = await createSession({ type, amount })
      // Use gameId directly from response — state update is async and not ready yet
      const result = await spin(sessionRes)
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
        syncResultBalance(result.balance)
      }, NOTIF_DELAY_MS + NOTIF_DURATION)
    } catch {
      setIsAnimating(false)
      clearTimeout(animTimerRef.current)
    }
  }

  const handleSpin = async () => {
    if (isBusy) return
    if (!session?.gameId) return

    setVisibleHistorySpins(spins)
    setIsAnimating(true)
    const result = await spin(session).catch(() => null)
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
      syncResultBalance(result.balance)
    }, NOTIF_DELAY_MS + NOTIF_DURATION)
  }

  const handleEnd = async () => {
    if (isBusy) return
    if (!session?.gameId) return

    await endSession(session.gameId)
    setVisibleHistorySpins([])
    setBetAmount("")
    setLastBet("")
  }

  const updateBetAmount = (amount) => {
    setBetAmount(amount)
  }

  const repeatBet = () => {
    if (lastBet) setBetAmount(lastBet)
  }

  const doubleBet = () => {
    setBetAmount((prev) => String((parseFloat(prev || 0) * 2).toFixed(2)))
  }

  const clearBet = () => {
    setBetAmount("")
  }

  const syncResultBalance = (balance) => {
    const nextBalance = Number(balance)
    if (!Number.isFinite(nextBalance)) return

    setUser((prev) => ({
      ...prev,
      balance: nextBalance.toFixed(2),
    }))
  }

  useEffect(() => {
    setBetAmount("")
    setLastBet("")
    setVisibleHistorySpins([])
    setIsAnimating(false)
    clearTimeout(animTimerRef.current)
    return () => clearTimeout(animTimerRef.current)
  }, [type])

  return (
    <div className="flex h-full w-full flex-col gap-4 p-2 sm:gap-1.5 sm:p-2 lg:gap-5 lg:p-4">
      <h2 className="text-center text-xl font-bold">
        {t(`games.slots.themes.${theme}.title`)}
      </h2>

      {!isActive && (
        <div className="flex flex-col gap-2  lg:contents">
          <SlotTypeSelector type={type} onTypeChange={onTypeChange} />

          <BettingInput
            bet={{
              betAmount: displayedBetAmount,
              updateBetAmount,
            }}
            readOnly={isActive || isBusy}
          />

          <SlotActions
            disabled={isBusy}
            theme={theme}
            showSessionActions={false}
            showHistory={false}
            bet={0}
          />

          <BettingBtns
            actions={{
              repeat: repeatBet,
              double: doubleBet,
              clear: clearBet,
              start: handleStart,
              startLabel: "games.slots.controls.spin",
              startSvg: isBusy ? <IconHourglass /> : <IconRotate360 />,
            }}
          />
        </div>
      )}

      {isActive && (
        <SlotActions
          disabled={isBusy}
          onSpin={handleSpin}
          onEndSession={handleEnd}
          theme={theme}
          spins={displayedSpins}
          historySpins={displayedSpins}
          bet={session?.bet ?? 0}
        />
      )}
    </div>
  )
}

export default SlotControls
