import React from "react"
import Button from "../buttons/Button"

const PlayBtn = ({ onClick }) => {
    return (
        <Button variant="secondary" className="font-bold" onClick={onClick}>
            Bet
        </Button>
    )
}

export default PlayBtn
