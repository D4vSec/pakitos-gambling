import React, { useState, useEffect, useRef } from "react"
import Card from "./Card"

const Hand = ({ hand }) => {
    const cards = hand?.hand || []

    const [visibleCount, setVisibleCount] = useState(0)
    const queueRef = useRef([])
    const dealingRef = useRef(false)

    useEffect(() => {
        const newCards = cards.slice(queueRef.current.length)

        if (newCards.length > 0) {
            queueRef.current = cards

            if (!dealingRef.current) {
                dealNext()
            }
        }
    }, [cards])

    const dealNext = () => {
        dealingRef.current = true

        setVisibleCount((prev) => prev + 1)
    }

    const handleFlipped = () => {
        if (visibleCount < cards.length) {
            setTimeout(() => {
                dealNext()
            }, 200)
        } else {
            dealingRef.current = false
        }
    }

    const visibleCards = cards.filter((card) => card.rank !== "hidden")
    const hasCards = visibleCards.length > 0

    const getCardValue = (rank) => {
        if (rank === "A") return 1
        if (["J", "Q", "K"].includes(rank)) return 10
        return Number(rank)
    }

    const lowValue = hasCards
        ? visibleCards.reduce((acc, card) => acc + getCardValue(card.rank), 0)
        : 0

    const hasAce = visibleCards.some((card) => card.rank === "A")
    const highValue = hasAce ? lowValue + 10 : lowValue

    let displayValue = lowValue

    if (hasAce && highValue <= 21) {
        displayValue = `${lowValue}/${highValue}`
    }

    return (
        <div className="z-10 flex flex-col gap-3 justify-center items-center">
            {hasCards && (
                <div className="flex items-start">
                    {cards.slice(0, visibleCount).map((card, i) => (
                        <div key={i} className={i !== 0 ? "-ml-10" : ""}>
                            <div style={{ marginTop: `${i * 1}rem` }}>
                                <Card
                                    card={card}
                                    animate
                                    onFlipped={i === visibleCount - 1 ? handleFlipped : undefined}
                                />
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
