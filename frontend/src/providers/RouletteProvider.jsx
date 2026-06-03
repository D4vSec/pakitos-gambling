import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useRef,
} from "react"
import useAPI from "@/hooks/useAPI"
import { useNotification } from "@/providers/NotificationProvider"
import { useSession } from "./SessionProvider"
import { useLocation } from "react-router-dom"
import { useLocale } from "./LocaleProvider"
import {
  CHIPS,
  ROULETTE_0_VALUES,
  ROULETTE_00_VALUES,
  ROULETTE_0_ORDER,
  ROULETTE_00_ORDER,
} from "@/components/games/roulette/rouletteConsts"

const WHEEL_OFFSET_DEG = 355
const WHEEL_INDEX_OFFSET = 0
const EMPTY_CHIPS = []
const DOUBLE_ZERO_SENTINEL = 37

const RouletteContext = createContext()
const RouletteAnimationContext = createContext()

const normalizeWinningNumber = (number) => {
  if (number === "00") return DOUBLE_ZERO_SENTINEL
  if (number === null || number === undefined || number === "") return number

  const parsedNumber = Number(number)
  return Number.isNaN(parsedNumber) ? number : parsedNumber
}

const formatWinningNumber = (number) => {
  const normalizedNumber = normalizeWinningNumber(number)
  return normalizedNumber === DOUBLE_ZERO_SENTINEL
    ? "00"
    : String(normalizedNumber)
}

const RouletteProvider = ({ children }) => {
  const location = useLocation()
  const rouletteType = useMemo(() => {
    if (location.pathname.includes("roulette00")) return "ZeroZero"
    if (location.pathname.includes("roulette0")) return "Zero"
    return "Zero"
  }, [location.pathname])

  const type = rouletteType

  const [game, setGame] = useState({
    rouletteType: rouletteType,
    bets: [],
  })

  const [betAmount, setBetAmount] = useState(0)
  const [selectedChip, setSelectedChip] = useState(0)
  const [winningNums, setWinningNums] = useState([])
  const [lastBet, setLastBet] = useState({})
  const [isSpinning, setIsSpinning] = useState(false)
  const [showSpinView, setShowSpinView] = useState(false)

  const [spinData, setSpinData] = useState(null)
  const [settledNumber, setSettledNumber] = useState(0)

  const rouletteRef = useRef(null)
  const gameRef = useRef(game)
  const spinDataRef = useRef(spinData)

  const { getRefreshToken, getAccessToken, updateBalance, user } = useSession()
  const { balance } = user
  const { addNotification } = useNotification()
  const { post } = useAPI()
  const { t } = useLocale()

  React.useEffect(() => {
    gameRef.current = game
  }, [game])

  React.useEffect(() => {
    spinDataRef.current = spinData
  }, [spinData])

  const getTotalPayout = useCallback((gameResult) => {
    if (!gameResult?.bets) return 0

    return gameResult.bets.reduce((total, bet) => {
      return total + (bet.payout || 0)
    }, 0)
  }, [])

  const getTotalBet = useCallback((gameResult) => {
    if (!gameResult?.bets) return 0

    return gameResult.bets.reduce((total, bet) => {
      return total + (bet.amount || 0)
    }, 0)
  }, [])

  const getGameOutcome = useCallback(
    (gameResult) => {
      const totalPayout = getTotalPayout(gameResult)
      const totalBet = getTotalBet(gameResult)

      if (totalPayout > totalBet) return "win"
      if (totalPayout < totalBet) return "lose"
      return "tie"
    },
    [getTotalBet, getTotalPayout],
  )

  const updateBets = useCallback(
    (bet) => {
      if (!selectedChip || selectedChip <= 0) {
        addNotification(t("message.warning.selectChipFirst"), "warning")
        return
      }

      if (balance < selectedChip) {
        addNotification(t("message.error.INSUFFICIENT_BALANCE"), "error")
        return
      }

      updateBalance("withdrawal", selectedChip)

      setGame((prev) => {
        const existingIndex = prev.bets.findIndex(
          (b) => b.type === bet.type && b.bet === bet.bet,
        )

        let updatedBets = []

        if (existingIndex !== -1) {
          updatedBets = [...prev.bets]
          updatedBets[existingIndex] = {
            ...updatedBets[existingIndex],
            amount: updatedBets[existingIndex].amount + selectedChip,
          }
        } else {
          updatedBets = [
            ...prev.bets,
            {
              type: bet.type,
              bet: bet.bet,
              amount: selectedChip,
            },
          ]
        }

        return {
          ...prev,
          bets: updatedBets,
        }
      })

      setBetAmount((prev) => prev + selectedChip)
    },
    [addNotification, balance, selectedChip, t, updateBalance],
  )

  const updateBetAmount = useCallback((amount) => {
    setBetAmount(amount)
  }, [])

  const updateChip = useCallback((chip) => setSelectedChip(chip), [])

  const clearBets = useCallback(() => {
    const currentGame = gameRef.current
    updateBalance(
      "deposit",
      currentGame.bets.reduce((total, bet) => total + bet.amount, 0),
    )
    setGame((prev) => ({
      ...prev,
      bets: [],
    }))
    setBetAmount(0)
  }, [updateBalance])

  const repeatBets = useCallback(() => {
    if (!Object.keys(lastBet).length) {
      addNotification(t("message.warning.playFirstToRepeat"), "warning")
      return
    }

    if (balance < lastBet.bets.reduce((total, bet) => total + bet.amount, 0)) {
      addNotification(t("message.error.INSUFFICIENT_BALANCE"), "error")
      return
    }

    clearBets()
    setGame(lastBet)
    const lastAmount = getTotalBet(lastBet)
    setBetAmount(lastAmount)
    updateBalance("withdrawal", lastAmount)
  }, [
    addNotification,
    balance,
    clearBets,
    getTotalBet,
    lastBet,
    t,
    updateBalance,
  ])

  const doubleBets = useCallback(() => {
    const totalCurrent = betAmount
    const totalAfterDouble = totalCurrent * 2

    if (totalCurrent === 0) {
      addNotification(t("message.error.INVALID_BET_AMOUNT"), "warning")
      return
    }

    if (balance < totalAfterDouble) {
      addNotification(t("message.warning.cantDouble"), "warning")
      return
    }
    updateBalance("withdrawal", totalCurrent)

    setGame((prev) => {
      return {
        ...prev,
        bets: prev.bets.map((bet) => ({
          ...bet,
          amount: bet.amount * 2,
        })),
      }
    })
    setBetAmount((prev) => prev * 2)
  }, [addNotification, balance, betAmount, t, updateBalance])

  const chipsCache = useMemo(() => {
    const cache = new Map()

    const sortedChips = [...CHIPS].sort((a, b) => b.value - a.value)

    for (const bet of game.bets) {
      let remaining = bet.amount
      const chips = []

      for (const chip of sortedChips) {
        while (remaining >= chip.value) {
          chips.push(chip)
          remaining -= chip.value
        }
      }

      // Unique key per betting cell.
      const key = `${bet.type}-${bet.bet}`
      cache.set(key, chips)
    }

    return cache
  }, [game.bets])

  const getChipsForCell = useCallback(
    (cell) => {
      const key = `${cell.type}-${cell.bet}`
      return chipsCache.get(key) ?? EMPTY_CHIPS
    },
    [chipsCache],
  )

  const getIndexFromNumber = useCallback(
    (number) => {
      const order = type === "ZeroZero" ? ROULETTE_00_ORDER : ROULETTE_0_ORDER
      const rawIndex = order.indexOf(normalizeWinningNumber(number))
      return (rawIndex + WHEEL_INDEX_OFFSET + order.length) % order.length
    },
    [type],
  )

  const { anglePerSlot, rotationOffset } = useMemo(() => {
    const order = type === "ZeroZero" ? ROULETTE_00_ORDER : ROULETTE_0_ORDER

    const anglePerSlot = 360 / order.length
    const rotationOffset = anglePerSlot / 2

    return {
      anglePerSlot,
      rotationOffset,
    }
  }, [type])

  const getFinalAngleFromIndex = useCallback(
    (index) => {
      const angle = index * anglePerSlot + rotationOffset + WHEEL_OFFSET_DEG

      return angle % 360
    },
    [anglePerSlot, rotationOffset],
  )

  const spin = useCallback(async () => {
    if (isSpinning || showSpinView) return

    try {
      setIsSpinning(true)
      setShowSpinView(true)

      const res = await post("/api/v1/roulette/spin", {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: game,
      })

      if (res.code) {
        throw new Error(res.code)
      }

      const outcome = getGameOutcome(res)
      const payout = getTotalPayout(res)
      const randomOffset = Math.random() * 360

      const winningNumber = normalizeWinningNumber(res?.result?.winningNumber)

      const index = getIndexFromNumber(winningNumber)
      const finalAngle = getFinalAngleFromIndex(index)

      setSpinData({
        winningNumber,
        color: res?.result?.color,
        index,
        finalAngle,
        outcome,
        payout,
        randomOffset,
      })

      // Se ejecuta handleFinish()
    } catch (error) {
      setShowSpinView(false)
      addNotification(t(`message.error.${error.message}`), "error")
    } finally {
      setIsSpinning(false)
    }
  }, [
    addNotification,
    game,
    getAccessToken,
    getFinalAngleFromIndex,
    getGameOutcome,
    getIndexFromNumber,
    getRefreshToken,
    getTotalPayout,
    isSpinning,
    post,
    showSpinView,
    t,
  ])

  const rouletteValues = useMemo(() => {
    if (type === "ZeroZero") return ROULETTE_00_VALUES
    if (type === "Zero") return ROULETTE_0_VALUES
    return []
  }, [type])

  const handleFinish = useCallback(() => {
    const data = spinDataRef.current
    if (!data) return

    setShowSpinView(false)

    setLastBet(gameRef.current)
    setSettledNumber(data.winningNumber)
    setSpinData(null)

    addNotification(
      `${t("message.info.winningNumber")}: ${formatWinningNumber(data.winningNumber)} | ${t(
        `games.roulette.board.${data.color}`,
      )}`,
      data.outcome === "win"
        ? "success"
        : data.outcome === "lose"
          ? "error"
          : "info",
      {
        scope: "games",
        duration: 4000,
        game: "roulette",
        outcome: data.outcome,
        number: data.winningNumber,
        payout: data.payout,
      },
    )

    setWinningNums((prev) => [data.winningNumber, ...prev].slice(0, 10))
    updateBalance("deposit", data.payout)

    setGame((prev) => ({
      ...prev,
      bets: [],
    }))

    setBetAmount(0)
  }, [addNotification, t, updateBalance])

  const animationValue = useMemo(
    () => ({
      rouletteRef,
      spinData,
      settledNumber,
      handleFinish,
    }),
    [handleFinish, settledNumber, spinData],
  )

  const value = useMemo(
    () => ({
      game,
      clearBets,
      updateBets,
      doubleBets,
      lastBet,
      repeatBets,
      selectedChip,
      updateChip,
      betAmount,
      updateBetAmount,
      winningNums,
      type,
      spin,
      isSpinning,
      spinData,
      settledNumber,
      showSpinView,
      rouletteRef,
      rouletteValues,
      getChipsForCell,
      getIndexFromNumber,
      getFinalAngleFromIndex,
      handleFinish,
      WHEEL_OFFSET_DEG,
    }),
    [
      clearBets,
      doubleBets,
      game,
      getChipsForCell,
      getFinalAngleFromIndex,
      getIndexFromNumber,
      handleFinish,
      isSpinning,
      lastBet,
      betAmount,
      repeatBets,
      rouletteValues,
      selectedChip,
      settledNumber,
      showSpinView,
      spin,
      spinData,
      type,
      updateBetAmount,
      updateBets,
      updateChip,
      winningNums,
    ],
  )

  return (
    <RouletteContext value={value}>
      <RouletteAnimationContext value={animationValue}>
        {children}
      </RouletteAnimationContext>
    </RouletteContext>
  )
}

const useRoulette = () => {
  const context = useContext(RouletteContext)
  if (!context) {
    throw new Error("Provider outside scope")
  }
  return context
}

const useRouletteAnimation = () => {
  const context = useContext(RouletteAnimationContext)
  if (!context) {
    throw new Error("Provider outside scope")
  }
  return context
}

export { useRoulette, useRouletteAnimation }
export default RouletteProvider
