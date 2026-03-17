import React from "react"
import BettingInput from "../../BettingInput"
import PlayBtn from "../../PlayBtn"
import BettingBtns from "./BettingBtns"
import { useBlackjack } from "@/providers/BlackjackProvider"

const BlackjackControls = () => {
    const { startGame, hit, stand, double, split } = useBlackjack()

    const actions = {
        hit: hit,
        stand: stand,
        double: double,
        split: split,
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full p-4">
            <h2 className="font-bold text-xl text-center m-0 p-0">Blackjack</h2>
            <BettingInput />
            <BettingBtns actions={actions} />
            <PlayBtn onClick={startGame} />
        </div>
    )
}

export default BlackjackControls
