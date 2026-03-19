import React, { useState } from "react"
import Button from "../buttons/Button"

const BettingInput = ({ betAmount, setBetAmount }) => {
    // TODO: Que no se resee el value a 0
    const [lastBetAmount, setLastBetAmount] = useState(0)

    const handleChange = (e) => {
        const value = e.target.value
        setBetAmount(value)
        setLastBetAmount(value)
    }

    const handleSame = () => {
        setBetAmount(lastBetAmount)
    }

    const handleDouble = () => {
        const num = Number(betAmount)
        if (!isNaN(num)) {
            setBetAmount(num * 2)
        }
    }

    return (
        <div className="flex flex-col md:flex-row items-baseline gap-1">
            <div className="flex flex-col w-full">
                <p className="fieldset-legend text-md">Bet Amount:</p>
                <div className="grid grid-col-4 grid-row-1 gap-1">
                    <input
                        type="number"
                        placeholder="Insert bet amount"
                        name="betAmount"
                        value={betAmount}
                        onChange={handleChange}
                        className="input col-span-2"
                    />

                    <Button variant="primary" className="col-span-1" onClick={handleSame}>
                        1x
                    </Button>

                    <Button variant="primary" className="col-span-1" onClick={handleDouble}>
                        2x
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default BettingInput
