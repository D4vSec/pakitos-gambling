import React from "react"
import Card from "./Card"

const Hand = ({ hand }) => {
    const cards = hand?.hand || []

    const hasCards = cards.length > 0

    const getCardValue = (rank) => {
        if (rank === "A") return 1
        if (["J", "Q", "K"].includes(rank)) return 10
        return Number(rank)
    }

    // 👉 calcular valores
    const lowValue = hasCards
        ? cards.reduce((acc, card) => acc + getCardValue(card.rank), 0)
        : 0

    const hasAce = cards.some((card) => card.rank === "A")

    const highValue = hasAce ? lowValue + 10 : lowValue

    // 👉 decidir qué mostrar
    let displayValue = lowValue

    if (hasAce && highValue <= 21) {
        displayValue = `${lowValue}/${highValue}`
    }

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

            <p className="font-bold text-xl">{displayValue}</p>
        </div>
    )
}

export default Hand