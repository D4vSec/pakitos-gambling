import React, { useState } from "react"
import BettingInput from "../../BettingInput"
import BlackjackActions from "./BlackjackActions"
import { useBlackjack } from "@/providers/BlackjackProvider"
import BettingBtns from "../../BettingBtns"

const BlackjackControls = () => {
  const {
    startGame,
    betAmount,
    updateBetAmount,
    repeatBet,
    doubleBet,
    clearBet,
    game,
  } = useBlackjack()

  const handleStartGame = () => {
    startGame()
  }

  const disabled = game?.status !== "ongoing"

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4">
      <h2 className="font-bold text-xl text-center m-0 p-0">Blackjack</h2>

      <BettingInput bet={{ betAmount, updateBetAmount }} readOnly={!disabled} />

      <BettingBtns
        actions={{
          repeat: repeatBet,
          double: doubleBet,
          clear: clearBet,
          start: handleStartGame,
        }}
        disabled={!disabled}>
        <BlackjackActions disabled={disabled} />
      </BettingBtns>
    </div>
  )
}

export default BlackjackControls
