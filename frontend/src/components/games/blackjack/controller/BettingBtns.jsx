import Button from "@/components/buttons/Button"
import React from "react"

const BettingBtns = ({ actions }) => {
    const buttons = [
        {
            label: "Hit",
            onClick: actions?.hit,
        },
        {
            label: "Stand",
            onClick: actions?.stand,
        },
        {
            label: "Split",
            onClick: actions?.split,
        },
        {
            label: "Double",
            onClick: actions?.double,
        },
    ]
    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {buttons.map((btn, i) => (
                <Button key={i} variant="neutral" onClick={btn.onClick}>
                    {btn.label}
                </Button>
            ))}
        </div>
    )
}

export default BettingBtns
