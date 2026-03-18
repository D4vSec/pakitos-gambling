import React, { useState } from "react"
import BettingInput from "../../BettingInput"
import PlayBtn from "../../PlayBtn"

const RouletteController = () => {
    const [betAmount, setBetAmount] = useState(0)

    const handleStartGame = () => {
        console.log("spin :)")
    }

    // TODO: Poner botones para elegir las fichas

    return (
        <div className="flex flex-col gap-4 w-full h-full p-4">
            <h2 className="font-bold text-xl text-center m-0 p-0">Roulette  </h2>

            <BettingInput betAmount={betAmount} setBetAmount={setBetAmount} />

            <PlayBtn onClick={handleStartGame} />
        </div>
    )
}

export default RouletteController
