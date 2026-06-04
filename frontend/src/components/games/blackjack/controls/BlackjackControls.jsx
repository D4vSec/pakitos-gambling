import React from "react"
import BettingInput from "../../BettingInput"
import BlackjackActions from "./BlackjackActions"
import { useBlackjack } from "@/providers/BlackjackProvider"
import BettingBtns from "../../BettingBtns"

const BlackjackControls = () => {
  const { startGame, betAmount, updateBetAmount, repeatBet, doubleBet, clearBet, game } =
    useBlackjack()
  const hasOngoingGame = game?.status === "ongoing"
  const disabled = !hasOngoingGame

  const handleStartGame = () => {
    if (hasOngoingGame) return
    startGame()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleStartGame()
  }

  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2 sm:gap-1.5 sm:p-2 lg:gap-5 lg:p-4">
      <h2 className="m-0 p-0 text-center text-xl font-bold">Blackjack</h2>

      <form className="flex flex-col gap-4 lg:hidden" onSubmit={handleSubmit}>
        <BettingInput bet={{ betAmount, updateBetAmount }} readOnly={hasOngoingGame} />

        {hasOngoingGame ? (
          <BlackjackActions disabled={false} />
        ) : (
          <BettingBtns
            actions={{
              repeat: repeatBet,
              double: doubleBet,
              clear: clearBet,
              start: handleStartGame,
            }}
            disabled={false}
          />
        )}
      </form>

      <form className="hidden lg:flex lg:flex-col lg:gap-4" onSubmit={handleSubmit}>
        <BettingInput bet={{ betAmount, updateBetAmount }} readOnly={!disabled} />

        <BettingBtns
          actions={{
            repeat: repeatBet,
            double: doubleBet,
            clear: clearBet,
            start: handleStartGame,
          }}
          disabled={!disabled}
        >
          <BlackjackActions disabled={disabled} />
        </BettingBtns>
      </form>
    </div>
  )
}

export default BlackjackControls
