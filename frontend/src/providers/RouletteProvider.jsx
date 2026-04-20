import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
} from "react"
import useAPI from "@/hooks/useAPI"
import { useNotification } from "@/providers/NotificationProvider"
import { useSession } from "./SessionProvider"
import { useLocation } from "react-router-dom"
import { useLocale } from "./LocaleProvider"
import {
  CHIPS,
  ROULETTE_VALUES,
} from "@/components/games/roulette/rouletteConsts"

const RouletteContext = createContext()

const HOST = "localhost:3000"

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
      return chipsCache.get(key) || []
    },
    [chipsCache],
  )

  const spin = async () => {
    const url = `http://${HOST}/v1/roulette/spin`

    try {
      const res = await post(url, {
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

      updateBalance("deposit", payout)

      const winningNumber =
        res?.result?.winningNumber === 37 ? "00" : res?.result?.winningNumber

      addNotification(
        `${t("message.info.winningNumber")}: ${res?.result?.winningNumber === 37 ? "00" : res?.result?.winningNumber} | ${t(`games.roulette.board.${res?.result?.color}`)}`,
        outcome === "win" ? "success" : outcome === "lose" ? "error" : "info",
        {
          scope: "games",
          duration: 4000,
          game: "roulette",
          outcome: outcome,
          number: winningNumber,
          payout: payout,
        },
      )

      setLastBet(game)

      setTimeout(() => {
        setWinningNums((prev) =>
          [res?.result?.winningNumber, ...prev].slice(0, 10),
        )
      }, [300])

      setGame((prev) => ({
        ...prev,
        bets: [],
      }))
      setBetAmount(0)
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
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

  const getRouletteValues = () => {
    return ROULETTE_VALUES.filter((item) => {
      if (type === "Zero") {
        return item.text !== "00"
      }
      return true
    })
  }

  const value = {
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
    getRouletteValues,
    getChipsForCell,
  }

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
