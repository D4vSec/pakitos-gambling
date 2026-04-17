import React, { useState, useEffect } from "react"
import Hearts from "./suits/Hearts"
import Diamonds from "./suits/Diamonds"
import Clubs from "./suits/Clubs"
import Spades from "./suits/Spades"
import CherrySVG from "@/components/svg/CherrySVG"

// TODO: Meter glow cuando pierdes / ganas
const Card = ({
  card,
  forceHidden = false,
  animate = true,
  isActive = false,
}) => {
  const { rank, suit } = card

  const isFaceDown = forceHidden || rank === "hidden" || suit === "hidden"

  const [mounted, setMounted] = useState(false)
  const [flipped, setFlipped] = useState(!isFaceDown)

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

  useEffect(() => {
    setMounted(false)

    const t1 = setTimeout(() => {
      setMounted(true)
    }, 30)

    const t2 = setTimeout(
      () => {
        if (!isFaceDown && animate) {
          setFlipped(true)
        } else {
          setFlipped(!isFaceDown)
        }
      },
      animate ? 800 : 0,
    )

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [rank, suit, isFaceDown, animate])

  return (
    <div
      className={`w-20 h-28 perspective-[1000px] transition-all duration-300 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}>
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-out transform-3d ${
          flipped ? "" : "transform-[rotateY(180deg)]"
        }`}>
        {/* FRONT */}
        <div
          className={`absolute w-full h-full bg-white ${
            isFaceDown ? "" : color[suit]
          } font-bold text-xl rounded-lg p-2 flex flex-col gap-1 backface-hidden border border-gray-200 shadow-md}
          ${isActive ? "ring-4 ring-green-400" : ""}`}>
          {!isFaceDown && <p className="ml-1">{rank}</p>}
          {!isFaceDown && symbol[suit]}
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full bg-blue-600 border-white border-6 rounded-lg flex items-center justify-center text-white transform-[rotateY(180deg)] backface-hidden shadow-md">
          <CherrySVG />
        </div>
      </div>
    </div>
  )
}

export default Card
