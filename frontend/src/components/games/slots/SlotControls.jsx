import React, { useRef, useState } from "react"
import { useSlots } from "@/providers/SlotsProvider"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import BettingInput from "@/components/games/BettingInput"
import BettingBtns from "@/components/games/BettingBtns"
import SlotActions from "./controls/SlotActions"
import SlotTypeSelector from "./controls/SlotTypeSelector"
import {
  IconCoinBitcoin,
  IconHourglass,
  IconPlayerPlay,
} from "@tabler/icons-react"
import { getAnimTotalMs, DIMS_BY_TYPE } from "./slotConstants"

const NOTIF_DURATION = 1000

const SlotControls = ({
  type = "3x3",
  theme = "starwars",
  onTypeChange,
}) => {
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
  const animTimerRef = useRef(null)

  const balance = parseFloat(user?.balance) || 0
  const totalPayout = spins.reduce((acc, s) => acc + (s.payout ?? 0), 0)
  const isActive = !!session
  const isBusy = loading || isAnimating
  const displayedBetAmount = isActive ? session.bet : betAmount

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

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4">
      <h2 className="font-bold text-xl text-center">
        {t(`games.slots.modes.${type}`)}
      </h2>

      {!isActive && (
        <>
          <SlotTypeSelector
            type={type}
            onTypeChange={onTypeChange}
            disabled={isBusy}
          />

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
              startSvg: isBusy ? <IconHourglass /> : <IconPlayerPlay />,
            }}
            disabled={{
              all: isBusy,
              repeat: !lastBet,
              double: !betAmount,
              start: !betAmount,
            }}
          />
        </>
      )}

      {isActive && (
        <SlotActions
          disabled={isBusy}
          onSpin={handleSpin}
          onEndSession={handleEnd}
          theme={theme}
          spins={spins}>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-70">
                {t("games.slots.controls.spins")}:
              </span>
              <span className="font-bold">{spins.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">
                {t("games.slots.controls.totalPayout")}:
              </span>
              <div className="flex items-center gap-1 font-bold">
                <span>{totalPayout.toFixed(2)}</span>
                <IconCoinBitcoin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </SlotActions>
      )}
    </div>
  )
}

export default SlotControls
