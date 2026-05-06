import React from "react"
import Hearts from "./suits/Hearts"
import Diamonds from "./suits/Diamonds"
import Clubs from "./suits/Clubs"
import Spades from "./suits/Spades"
import CherrySVG from "@/components/svg/pictures/CherrySVG"

const Card = ({ card, forceHidden = false, isActive = false, flipped }) => {
  const { rank, suit } = card

  const isHidden = forceHidden || rank === "hidden" || suit === "hidden"

  const shouldBeFlipped = flipped ?? !isHidden

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

  return (
    <div className="w-17 h-23 md:w-20 md:h-28 perspective-[1000px]">
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: shouldBeFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
        }}>
        {/* FRONT */}
        <div
          className={`absolute w-full h-full bg-white ${
            isHidden ? "" : color[suit]
          } font-bold text-xl rounded-lg p-2 flex flex-col gap-1 backface-hidden border border-gray-200 shadow-md ${
            isActive ? "ring-4 ring-green-400" : ""
          }`}
          style={{ backfaceVisibility: "hidden" }}>
          {!isHidden && (
            <>
              <p className="ml-1">{rank}</p>
              {symbol[suit]}
            </>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute w-full h-full bg-blue-600 rounded-lg border-white border-6 flex items-center justify-center text-white shadow-md"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}>
          <CherrySVG />
        </div>
      </div>
    </div>
  )
}

export default Card
