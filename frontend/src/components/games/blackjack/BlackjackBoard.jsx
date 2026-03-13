import React from "react"
import Card from "./Card"
import Hand from "./Hand"
import Deck from "./Deck"
import "./BlackjackBoard.css"

const BlackjackBoard = () => {
    return (
        <div className="w-full h-full grid grid-cols-[1fr_3fr_1fr] grid-rows-4">
            <div className="dealer flex justify-center items-start">
                <Hand />
            </div>

            <div className="player flex justify-center items-end">
                <Hand />
            </div>

            <div className="deck flex justify-center items-start">
                <Deck />
            </div>
        </div>
    )
}

export default BlackjackBoard
