import React, { useState } from "react"
import BettingInput from "../../BettingInput"
import PlayBtn from "../../PlayBtn"
import BettingBtns from "./BettingBtns"
import { useBlackjack } from "@/providers/BlackjackProvider"
import { useSession } from "@/providers/SessionProvider"

const BlackjackControls = () => {
    const { startGame, hit, stand, double, split } = useBlackjack()
    const { updateBalance } = useSession()

    const [betAmount, setBetAmount] = useState(0)

    const actions = {
        hit,
        stand,
        double,
        split,
    }

    const handleStartGame = () => {
        updateBalance("withdrawal", Number(betAmount))
        startGame(Number(betAmount))
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full p-4">
            <h2 className="font-bold text-xl text-center m-0 p-0">Blackjack</h2>

            <BettingInput betAmount={betAmount} setBetAmount={setBetAmount} />

            <BettingBtns actions={actions} />

            <PlayBtn onClick={handleStartGame} />
        </div>
    )
}

export default BlackjackControls
