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

const SlotControls = ({ theme = "starwars" }) => {
  const { type, setType, session, spins, loading, createSession, spin, endSession } =
    useSlots()
  const dims = DIMS_BY_TYPE[type] ?? { rows: 3, cols: 3 }
  const NOTIF_DELAY_MS = getAnimTotalMs(dims.cols, dims.rows)
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

  const adjustUserBalance = (delta) => {
    const amount = Number(delta)
    if (!Number.isFinite(amount) || amount === 0) return

    setUser((prev) => {
      const currentBalance = Number(prev?.balance ?? 0)
      if (!Number.isFinite(currentBalance)) return prev

      return {
        ...prev,
        balance: (currentBalance + amount).toFixed(2),
      }
    })
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
    let hasAppliedSpinDeduction = false

    try {
      const sessionRes = await createSession({ type, amount })
      adjustUserBalance(-Number(sessionRes.bet ?? amount))
      hasAppliedSpinDeduction = true
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
        adjustUserBalance(result.isWinner ? Number(sessionRes.bet ?? amount) + Number(result.payout ?? 0) : 0)
      }, NOTIF_DELAY_MS)
    } catch {
      if (hasAppliedSpinDeduction) {
        adjustUserBalance(Number(amount))
      }
      setIsAnimating(false)
      clearTimeout(animTimerRef.current)
    }
  }

  const handleStartSubmit = async (e) => {
    e.preventDefault()
    await handleStart()
  }

  const handleSpin = async () => {
    if (isBusy) return
    if (!session?.gameId) return

    setVisibleHistorySpins(spins)
    setIsAnimating(true)
    adjustUserBalance(-Number(session.bet ?? 0))
    const result = await spin(session).catch(() => null)
    if (!result) {
      adjustUserBalance(Number(session.bet ?? 0))
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
      adjustUserBalance(result.isWinner ? Number(session.bet ?? 0) + Number(result.payout ?? 0) : 0)
    }, NOTIF_DELAY_MS)
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
        <>
          <SlotActions
            disabled={isBusy}
            theme={theme}
            showSessionActions={false}
            showHistory={false}
            bet={0}
          />

          <form className="flex flex-col gap-2  lg:contents" onSubmit={handleStartSubmit}>
            <SlotTypeSelector type={type} onTypeChange={setType} />

            <BettingInput
              bet={{
                betAmount: displayedBetAmount,
                updateBetAmount,
              }}
              readOnly={isActive || isBusy}
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
          </form>
        </>
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
