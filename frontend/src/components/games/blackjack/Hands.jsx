import React from "react"
import Hand from "./Hand"

const Hands = () => {
    return (
        <div className="flex gap-8">
            {Array.from({ length: 2 }).map((hand) => (
                <Hand />
            ))}
        </div>
    )
}

export default Hands
