import Button from "@/components/buttons/Button"
import React from "react"

const BettingBtns = () => {
    const buttons = [
        {
            label: "Hit",
            onClick: () => console.log("hit"),
        },
        {
            label: "Stand",
            onClick: () => console.log("stand"),
        },
        {
            label: "Split",
            onClick: () => console.log("split"),
        },
        {
            label: "Double",
            onClick: () => console.log("double"),
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
