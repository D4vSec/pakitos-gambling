import React from "react"
import BettingInput from "../../BettingInput"
import ChipSelector from "./ChipSelector"
import { useRoulette } from "@/providers/RouletteProvider"
import { useNotification } from "@/providers/NotificationProvider"
import BettingBtns from "../../BettingBtns"

const RouletteControls = () => {
    const {
        betAmount,
        updateBetAmount,
        selectedChip,
        updateChip,
        clearBets,
        repeatBets,
        doubleBets,
        game,
        spin,
    } = useRoulette()

    const { addNotification } = useNotification()

    const handleStartGame = () => {
        if (betAmount <= 0) {
            addNotification("The bet can't be 0", "error")
            return
        }
        console.log("g", game)
        addNotification("Spinning...", "warning", { duration: 2000 })

        setTimeout(() => {
            spin()
        }, 2000)
    }

    // TODO: Hacer algo con los botones de 1x, 2x posiblemente me los ventile
    // TODO  Bloquea el cambiar el amount de la ruleta
    return (
        <div className="flex flex-col gap-6 w-full h-full p-4">
            <h2 className="font-bold text-xl text-center">Roulette</h2>

            <BettingInput bet={{ betAmount, updateBetAmount }} readOnly />

            <BettingBtns
                actions={{
                    repeat: repeatBets,
                    clear: clearBets,
                    double: doubleBets,
                    start: handleStartGame,
                }}
            ></BettingBtns>

            <ChipSelector selectedChip={selectedChip} setSelectedChip={updateChip} />
        </div>
    )
}

export default RouletteControls
