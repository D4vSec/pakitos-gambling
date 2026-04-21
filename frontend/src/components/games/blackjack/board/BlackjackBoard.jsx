import React, { useEffect } from "react"
import Hands from "../Hands"
import Deck from "../Deck"
import { useBlackjack } from "@/providers/BlackjackProvider"
import { useLocale } from "@/providers/LocaleProvider"
import "./BlackjackBoard.css"

const BlackjackBoard = () => {
  const { game, finishGame } = useBlackjack()
  const { dealer, player } = game
  const { t } = useLocale()

  useEffect(() => {
    if (game?.status === "finished") {
      finishGame(game)
    }
  }, [game])

  return (
    <div className="w-full h-full grid grid-cols-[1fr_3fr_1fr] grid-rows-[repeat(4,1fr)] gap-4 bg-accent">
      <div className="dealer flex justify-center items-center">
        <Hands player={"dealer"} hands={dealer} gameState={game?.status} />
      </div>

      <div className="player flex justify-center items-center">
        <Hands player={"player"} hands={player} gameState={game?.status} />
      </div>

      <div className="deck flex justify-center items-start">
        <Deck />
      </div>
      <div className="opacity-80 bg-blackjack flex justify-center items-center">
        <div className="bg-primary px-10 py-2 rounded-md shadow-md transform -skew-x-12">
          <p className="font-bold text-xl text-white skew-x-12">
            {t("games.blackjack.bkPays")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlackjackBoard
