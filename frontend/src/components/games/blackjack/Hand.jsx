import React from "react"
import Card from "./Card"

const Hand = ({ hand }) => {
    console.log("hand", hand)

    const getCardValue = (rank) => {
        if (rank === "A") return 1
        if (["J", "Q", "K"].includes(rank)) return 10
        return Number(rank)
    }

    const cards = hand?.hand || []

    const hasCards = cards.length > 0

    const handValue = hand?.value

    return (
        <div className="z-10 flex flex-col gap-3 justify-center items-center">
            {hasCards && (
                <div className="flex items-start">
                    {cards.map((card, i) => (
                        <div key={i} className={i !== 0 ? "-ml-10" : ""}>
                            <div style={{ marginTop: `${i * 1}rem` }}>
                                <Card card={card} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="font-bold text-xl">{handValue}</p>
        </div>
    )
}

export default Hand
