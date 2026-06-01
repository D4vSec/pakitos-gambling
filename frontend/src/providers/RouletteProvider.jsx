import React, {
  createContext,
  useContext,
  useCallback,
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

const RouletteContext = createContext()

const WHEEL_OFFSET_DEG = 355
const WHEEL_INDEX_OFFSET = 0

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

  const { getRefreshToken, getAccessToken, updateBalance, user } = useSession()
  const { balance } = user
  const { addNotification } = useNotification()
  const { post } = useAPI()
  const { t } = useLocale()

  const updateBets = (bet) => {
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
    console.log(game)
  }

  const updateBetAmount = (amount) => {
    setBetAmount(amount)
  }

  const updateChip = (chip) => setSelectedChip(chip)

  const repeatBets = () => {
    if (!Object.keys(lastBet).length) {
      addNotification(t("message.warning.playFirstToRepeat"), "warning")
      return
    }

    if (balance < lastBet.bets.reduce((total, bet) => total + bet.amount, 0)) {
      addNotification(t("message.error.INSUFFICIENT_BALANCE"), "error")
      return
    }

    clearBets()
    console.log("bb", lastBet.bets)
    console.log("l", lastBet)
    setGame(lastBet)
    const lastAmount = getTotalBet(lastBet)
    setBetAmount(lastAmount)
    updateBalance("withdrawal", lastAmount)
  }

  const clearBets = () => {
    updateBalance(
      "deposit",
      game.bets.reduce((total, bet) => total + bet.amount, 0),
    )
    setGame((prev) => ({
      ...prev,
      bets: [],
    }))
    setBetAmount(0)
  }

  const doubleBets = () => {
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
  }

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

      // clave única por celda
      const key = `${bet.type}-${bet.bet}`
      cache.set(key, chips)
    }

    return cache
  }, [game.bets])

  const getChipsForCell = useCallback(
    (cell) => {
      const key = `${cell.type}-${cell.bet}`
      const EMPTY = []
      return chipsCache.get(key) ?? EMPTY
    },
    [chipsCache],
  )

  const getIndexFromNumber = (number) => {
    const order = type === "ZeroZero" ? ROULETTE_00_ORDER : ROULETTE_0_ORDER
    const rawIndex = order.indexOf(number)
    return (rawIndex + WHEEL_INDEX_OFFSET + order.length) % order.length
  }

  const { anglePerSlot, rotationOffset } = useMemo(() => {
    const order = type === "ZeroZero" ? ROULETTE_00_ORDER : ROULETTE_0_ORDER

    const anglePerSlot = 360 / order.length
    const rotationOffset = anglePerSlot / 2

    return {
      anglePerSlot,
      rotationOffset,
    }
  }, [type])

  const getFinalAngleFromIndex = (index) => {
    const angle = index * anglePerSlot + rotationOffset + WHEEL_OFFSET_DEG

    return angle % 360
  }

  const spin = async () => {
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

      console.log("rouletteStatus", res)

      const outcome = getGameOutcome(res)
      const payout = getTotalPayout(res)
      const randomOffset = Math.random() * 360

      const winningNumber = res?.result?.winningNumber

      const index = getIndexFromNumber(winningNumber)
      const finalAngle = getFinalAngleFromIndex(index)

      console.log("1", {
        winningNumber,
        index,
        finalAngle,
      })

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
  }

  const getTotalPayout = (gameResult) => {
    if (!gameResult?.bets) return 0

    return gameResult.bets.reduce((total, bet) => {
      return total + (bet.payout || 0)
    }, 0)
  }

  const getTotalBet = (gameResult) => {
    if (!gameResult?.bets) return 0

    return gameResult.bets.reduce((total, bet) => {
      return total + (bet.amount || 0)
    }, 0)
  }

  const getGameOutcome = (gameResult) => {
    const totalPayout = getTotalPayout(gameResult)
    console.log("payout", totalPayout)
    const totalBet = getTotalBet(gameResult)
    console.log("bet", totalBet)

    if (totalPayout > totalBet) return "win"
    if (totalPayout < totalBet) return "lose"
    return "tie"
  }

  const rouletteValues = useMemo(() => {
    if (type === "ZeroZero") return ROULETTE_00_VALUES
    if (type === "Zero") return ROULETTE_0_VALUES
    return []
  }, [type])

  const handleFinish = useCallback(() => {
    if (!spinData) return
    const data = spinData

    setShowSpinView(false)

    setLastBet(game)
    setSettledNumber(data.winningNumber)
    setSpinData(null)

    addNotification(
      `${t("message.info.winningNumber")}: ${data.winningNumber} | ${t(
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
  }, [addNotification, game, spinData, t, updateBalance])

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
      game,
      lastBet,
      selectedChip,
      betAmount,
      winningNums,
      type,
      isSpinning,
      spinData,
      settledNumber,
      showSpinView,
      rouletteValues,
      getChipsForCell,
      handleFinish,
    ],
  )

  return <RouletteContext value={value}>{children}</RouletteContext>
}

export default RouletteProvider

export const useRoulette = () => {
  const context = useContext(RouletteContext)

  if (!context) {
    throw new Error("Provider outside scope")
  }

  return context
}
