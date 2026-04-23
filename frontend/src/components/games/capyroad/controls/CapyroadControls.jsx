import React, { useState } from "react"
import BettingInput from "../../BettingInput"
import BettingBtns from "../../BettingBtns"
import { useCapyroad } from "@/providers/CapyroadProvider"
import CapyroadActions from "./CapyroadActions"

const CapyroadControls = () => {
  const {
    betAmount,
    updateBetAmount,
    repeatBet,
    doubleBet,
    clearBet,
    game,
    startGame,
  } = useCapyroad()

  const disabled = game?.status === "finished"
  return (
    <div className="flex flex-col gap-4 w-full h-full p-4">
      <h2 className="font-bold text-xl text-center m-0 p-0">Capyroad</h2>

      <BettingInput bet={{ betAmount, updateBetAmount }} readOnly={!disabled} />

      <BettingBtns
        actions={{
          repeat: repeatBet,
          double: doubleBet,
          clear: clearBet,
          start: startGame,
        }}
        disabled={disabled}>
        <CapyroadActions disabled={disabled} />
      </BettingBtns>
    </div>
  )
}

export default CapyroadControls
