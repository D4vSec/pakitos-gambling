import React, { useState } from "react"
import Hearts from "./svg/Hearts"
import Diamonds from "./svg/Diamonds"
import Clubs from "./svg/Clubs"
import Spades from "./svg/Spades"
import CherrySVG from "@/components/svg/CherrySVG"

const Card = ({ card, faceDown }) => {
    const { rank, suit } = card
    const [display, setDisplay] = useState(faceDown)

    const red = "text-red-500"
    const black = "text-black"

    const color = {
        Hearts: red,
        Diamonds: red,
        Clubs: black,
        Spades: black,
    }

    const symbol = {
        Hearts: <Hearts />,
        Diamonds: <Diamonds />,
        Clubs: <Clubs />,
        Spades: <Spades />,
    }

    return (
        <div className="w-20 h-28 perspective-[1000px]" onClick={() => setDisplay(!display)}>
            <div
                className={`relative w-full h-full transition-transform duration-500 transform-3d ${
                    display ? "transform-[rotateY(180deg)]" : ""
                }`}
            >
                {/* FRONT */}
                <div
                    className={`absolute w-full h-full bg-white ${color[suit]} font-bold text-xl rounded-lg p-2 flex flex-col gap-1 backface-hidden border border-gray-200 shadow-md`}
                >
                    <p className="ml-1">{rank}</p>
                    {symbol[suit]}
                </div>

                {/* BACK */}
                <div className="absolute w-full h-full bg-blue-600  border-white border-6 rounded-lg flex items-center justify-center text-white transform-[rotateY(180deg)] backface-hidden shadow-md">
                    <CherrySVG />
                </div>
            </div>
        </div>
    )
}

export default Card
