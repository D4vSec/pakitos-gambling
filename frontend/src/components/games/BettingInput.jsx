import React, { useState } from "react"
import Button from "../buttons/Button"

const BettingInput = ({ betAmount, setBetAmount }) => {
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
            <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Bet Amount</legend>
                <input
                    type="number"
                    placeholder="Insert bet amount"
                    name="betAmount"
                    value={betAmount}
                    onChange={handleChange}
                    className="input w-full"
                />
            </fieldset>

            <Button variant="primary" onClick={handleSame}>
                1x
            </Button>

            <Button variant="primary" onClick={handleDouble}>
                2x
            </Button>
        </div>
    )
}

export default BettingInput
