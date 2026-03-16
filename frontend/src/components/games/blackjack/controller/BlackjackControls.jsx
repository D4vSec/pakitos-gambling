import React from "react"
import BettingInput from "../../BettingInput"
import PlayBtn from "../../PlayBtn"
import BettingBtns from "./BettingBtns"

const BlackjackControls = () => {
    return (
        <div className="flex flex-col gap-4 w-full h-full p-4">
            <h2 className="font-bold text-xl text-center m-0 p-0">Blackjack</h2>
            <BettingInput />
            <BettingBtns />
            <PlayBtn />
        </div>
    )
}   

export default BlackjackControls
