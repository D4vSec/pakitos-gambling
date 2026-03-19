import React, { useEffect, useState } from "react"
import BettingInput from "../../BettingInput"
import PlayBtn from "../../PlayBtn"
import ChipSelector from "./ChipSelector"
import { useRoulette } from "@/providers/RouletteProvider"
import Button from "@/components/buttons/Button"
import { useNotification } from "@/providers/NotificationProvider"

const RouletteController = () => {
    const { betAmount, updateBetAmount, selectedChip, updateChip, clearBets, repeatBet, spin } =
        useRoulette()
    const { addNotification } = useNotification()

    const handleStartGame = () => {
        if (betAmount <= 0) {
            addNotification("The bet can't be 0", "error")
            return
        }
        addNotification("Spinning...", "warning")

        setTimeout(() => {
            spin()
        }, 2000)
    }

    // TODO: Hacer algo con los botones de 1x, 2x posiblemente me los ventile
    // TODO  BLoquea el cambiar el amount de la ruleta
    return (
        <div className="flex flex-col gap-5 w-full h-full p-4">
            <h2 className="font-bold text-xl text-center">Roulette</h2>

            <BettingInput betAmount={betAmount} setBetAmount={updateBetAmount} />

            <Button variant="neutral" onClick={clearBets}>
                Clear bets
            </Button>
            <Button variant="neutral" onClick={repeatBet}>
                Repeat bet
            </Button>

            <ChipSelector selectedChip={selectedChip} setSelectedChip={updateChip} />

            <PlayBtn onClick={handleStartGame} />
        </div>
    )
}

export default RouletteController
