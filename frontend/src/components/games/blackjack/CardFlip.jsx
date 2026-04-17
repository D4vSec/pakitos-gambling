import React, { useState, useEffect } from "react"
import Hearts from "./suits/Hearts"
import Diamonds from "./suits/Diamonds"
import Clubs from "./suits/Clubs"
import Spades from "./suits/Spades"
import CherrySVG from "@/components/svg/CherrySVG"

const Card = ({ card, reveal = false, forceHidden = false }) => {
  const { rank, suit } = card

  const isFaceDown = forceHidden || rank === "hidden" || suit === "hidden"

  const [mounted, setMounted] = useState(false)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setMounted(false)
    setFlipped(false)

    if (isFaceDown) return

    const mountTimer = setTimeout(() => {
      setMounted(true)
    }, 30)

    const flipTimer = setTimeout(() => {
      if (reveal) {
        setFlipped(true)
      }
    }, 700)

    return () => {
      clearTimeout(mountTimer)
      clearTimeout(flipTimer)
    }
  }, [rank, suit, reveal, isFaceDown])

  const color = {
    Hearts: "text-red-500",
    Diamonds: "text-red-500",
    Clubs: "text-black",
    Spades: "text-black",
  }

  const symbol = {
    Hearts: <Hearts />,
    Diamonds: <Diamonds />,
    Clubs: <Clubs />,
    Spades: <Spades />,
  }

  if (isFaceDown) {
    return (
      <div className="w-20 h-28 perspective-[1000px]">
        <div className="w-full h-full bg-blue-600 border-6 border-white rounded-lg flex items-center justify-center text-white shadow-md">
          <CherrySVG />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`w-20 h-28 perspective-[1000px] transition-all duration-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}>
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-out transform-3d ${
          flipped ? "" : "transform-[rotateY(180deg)]"
        }`}>
        <div
          className={`absolute w-full h-full bg-white ${color[suit]} font-bold text-xl rounded-lg p-2 flex flex-col gap-1 backface-hidden border border-gray-200 shadow-md`}>
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
