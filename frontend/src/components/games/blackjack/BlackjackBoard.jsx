import React from "react"
import Hand from "./Hand"
import Hands from "./Hands"
import Deck from "./Deck"
import "./BlackjackBoard.css"

const BlackjackBoard = () => {
    return (
        <div className="w-full h-full grid grid-cols-[1fr_3fr_1fr] grid-rows-4 gap-4 bg-accent">
            <div className="dealer flex justify-center items-center">
                <Hand />
            </div>

            <div className="player flex justify-center items-center">
                <Hands />
            </div>

            <div className="deck flex justify-center items-start">
                <Deck />
            </div>
            <div className="opacity-80 bg-blackjack flex justify-center items-center">
                <div className="bg-primary px-10 py-2 rounded-md shadow-md transform -skew-x-12">
                    <p className="font-bold text-xl text-white skew-x-12">Blackjack pays 3 to 2</p>
                </div>
            </div>
        </div>
    )
}

export default BlackjackBoard
