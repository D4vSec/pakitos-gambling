import React, { createContext, useContext, useEffect, useState, useMemo } from "react"
import useAPI from "@/hooks/useAPI"
import { useNotification } from "@/providers/NotificationProvider"
import { useSession } from "./SessionProvider"
import { useLocation } from "react-router-dom"
import rouletteValues from "@/components/games/roulette/table/rouletteValues"

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
    const [lastBet, setLastBet] = useState([])
    const [lastBetAmount, setLastBetAmount] = useState(0)

    const { getRefreshToken, getAccessToken, updateBalance } = useSession()
    const { addNotification } = useNotification()
    const { post } = useAPI()

    const updateBets = (bet) => {
        if (!selectedChip || selectedChip <= 0) {
            addNotification("Select a chip first to place it", "warning")
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

    const repeatBet = () => {
        if (!lastBet) return
        setGame(lastBet)
        setBetAmount(getTotalBet(lastBet))
    }

    const clearBets = () => {
        setGame((prev) => ({
            ...prev,
            bets: [],
        }))
        setBetAmount(0)
    }

    const getChipsForCell = (cell) => {
        const bet = game.bets.find((b) => b.type === cell.type && b.bet === cell.bet)

        if (!bet) return []

        const chips = []
        let remaining = bet.amount

        while (remaining > 0) {
            chips.push({ value: selectedChip })
            remaining -= selectedChip
        }

        return chips
    }

    // TODO: Revisar que el amount no sea 0
    // TODO: El apostar al half no va (roulette.isHalfWinner is not a function rouletteController:85:37)
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

            addNotification(
                `Winning number: ${res?.result?.winningNumber} | ${res?.result?.color}`,
                "info",
            )

            const outcome = getGameOutcome(res)
            addNotification(
                outcome,
                outcome === "win" ? "success" : outcome === "lose" ? "error" : "info",
            )

            const payout = getTotalPayout(res)
            updateBalance("deposit", payout)

            setLastBet(game)

            setWinningNums((prev) => [res?.result?.winningNumber, ...prev].slice(0, 10))

            clearBets()
        } catch (error) {
            addNotification(error.message, "error")
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
        const totalBet = getTotalBet(gameResult)

        if (totalPayout > totalBet) return "win"
        if (totalPayout < totalBet) return "lose"
        return "tie"
    }

    const getRouletteValues = () => {
        return rouletteValues.filter((item) => {
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
        lastBet,
        repeatBet,
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
