import React, { useState, useEffect } from "react"
import Hearts from "./suits/Hearts"
import Diamonds from "./suits/Diamonds"
import Clubs from "./suits/Clubs"
import Spades from "./suits/Spades"
import CherrySVG from "@/components/svg/CherrySVG"

const Card = ({ card, forceHidden = false, animate = true, onFlipped }) => {
    const { rank, suit } = card

    const isHidden = forceHidden || rank === "hidden" || suit === "hidden"

    const [flipped, setFlipped] = useState(false)

    useEffect(() => {
        if (!isHidden && animate) {
            const t = setTimeout(() => {
                setFlipped(true)
                onFlipped && onFlipped()
            }, 400)
            return () => clearTimeout(t)
        } else {
            setFlipped(!isHidden)
        }
    }, [isHidden, animate, onFlipped])

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
        <div className="w-20 h-28 perspective-[1000px]">
            <div
                className={`relative w-full h-full transition-transform duration-500 transform-3d ${
                    flipped ? "" : "transform-[rotateY(180deg)]"
                }`}
            >
                <div
                    className={`absolute w-full h-full bg-white ${color[suit]} font-bold text-xl rounded-lg p-2 flex flex-col gap-1 backface-hidden border border-gray-200 shadow-md`}
                >
                    <p className="ml-1">{rank}</p>
                    {symbol[suit]}
                </div>

                <div className="absolute w-full h-full bg-blue-600 border-white border-6 rounded-lg flex items-center justify-center text-white transform-[rotateY(180deg)] backface-hidden shadow-md">
                    <CherrySVG />
                </div>
            </div>
        </div>
    )
}

export default Card
