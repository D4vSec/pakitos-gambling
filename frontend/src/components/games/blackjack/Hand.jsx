import React from "react"
import Card from "./Card"

const Hand = () => {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
    const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let deck = []

    const createDeck = () => {
        for (let suit of suits) {
            for (let card of cards) {
                deck.push({ rank: card, suit: suit })
            }
        }
        return deck
    }

    createDeck()

    deck = deck.slice(0, 5)

    const getCardValue = (rank) => {
        if (rank === "A") return 1
        if (["J", "Q", "K"].includes(rank)) return 10
        return Number(rank)
    }

    const handValue = deck.reduce((acc, card) => acc + getCardValue(card.rank), 0)

    return (
        <div className="z-10 flex flex-col gap-3 justify-center items-center">
            <div className="flex items-start">
                {deck.map((card, i) => (
                    <div key={i} className={i !== 0 ? "-ml-10" : ""}>
                        <div style={{ marginTop: `${i * 1}rem` }}>
                            <Card card={card} faceDown={false} />
                        </div>
                    </div>
                ))}
            </div>
            <p className="font-bold text-xl">{handValue}</p>
        </div>
    )
}

export default Hand
