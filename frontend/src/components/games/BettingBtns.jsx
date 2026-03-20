import React from "react"
import Button from "../buttons/Button"
import ReloadSVG from "../svg/ReloadSVG"

const BettingBtns = ({ children, actions }) => {
    const { repeat, clear, double, start } = actions
    
    return (
        <div className="flex flex-wrap gap-4 w-full">
            <div className="flex flex-wrap gap-2 w-full">
                <Button
                    variant="primary"
                    className="flex-1 basis-0 min-w-fit"
                    svg={<ReloadSVG />}
                    onClick={repeat}
                >
                    Repeat Bet
                </Button>

                <Button variant="primary" className="flex-1 basis-0 min-w-fit" onClick={double}>
                    Double Bet
                </Button>

                <Button variant="primary" className="w-full" onClick={clear}>
                    Clear Bet
                </Button>
            </div>
            {children}
            <Button variant="secondary" className="min-w-fit w-full" onClick={start}>
                Bet
            </Button>
        </div>
    )
}

export default BettingBtns
