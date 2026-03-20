import React from "react"

const BettingInput = ({ bet, readOnly }) => {
    const { betAmount, updateBetAmount } = bet
    return (
        <div className="flex flex-col md:flex-row items-baseline gap-1">
            <div className="flex flex-col gap-1 w-full">
                <p className="fieldset-legend text-md">Bet Amount:</p>
                <input
                    type="number"
                    placeholder="Insert bet amount"
                    name="betAmount"
                    value={betAmount}
                    readOnly={readOnly || false}
                    onChange={(e) => updateBetAmount(Number(e.target.value))}
                    className="input w-full"
                />
            </div>
        </div>
    )
}

export default BettingInput
