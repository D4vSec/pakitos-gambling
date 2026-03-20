import Button from "@/components/buttons/Button"
import React from "react"
import { useBlackjack } from "@/providers/BlackjackProvider"

const BlackjackActions = () => {
    const { hit, stand, double, split } = useBlackjack()

    const buttons = [
        {
            label: "Hit",
            onClick: hit,
        },
        {
            label: "Stand",
            onClick: stand,
        },
        {
            label: "Split",
            onClick: split,
        },
        {
            label: "Double",
            onClick: double,
        },
    ]
    return (
        <div className="w-full grid grid-cols-2 grid-row-2 gap-2">
            {buttons.map((btn, i) => (
                <Button key={i} variant="neutral" className="flex-1 min-w-fit" onClick={btn.onClick}>
                    {btn.label}
                </Button>
            ))}
        </div>
    )
}

export default BlackjackActions
