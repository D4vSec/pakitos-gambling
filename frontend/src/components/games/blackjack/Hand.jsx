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

    deck = deck.slice(0, 2)
    const offsetX = 40
    const offsetY = 30
    const cardWidth = 80
    const cardHeight = 112

    return (
        <div
            className="relative"
            style={{
                width: cardWidth + (deck.length - 1) * offsetX,
                height: cardHeight + (deck.length - 1) * offsetY,
            }}
        >
            {deck.map((card, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{
                        top: i * offsetY,
                        left: i * offsetX,
                    }}
                >
                    <Card card={card} faceDown={false} />
                </div>
            ))}
        </div>
    )
}

export default Hand
