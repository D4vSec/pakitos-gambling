import React from "react"
import {
  IconHeart,
  IconClubs,
  IconSpade,
  IconDiamond,
  IconCherry,
} from "@tabler/icons-react"

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
    Hearts: <IconHeart fill="red" />,
    Diamonds: <IconDiamond fill="red" />,
    Clubs: <IconClubs fill="black" />,
    Spades: <IconSpade fill="black" />,
  }

  return (
    <div className="w-[clamp(3.75rem,8vw,5rem)] lg:w-[clamp(5.5rem,6vw,6rem)] aspect-5/7 perspective-[1000px]">
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
          } flex flex-col gap-0.5 rounded-lg border border-gray-200 p-1.5 font-bold text-[clamp(0.875rem,2.2vw,1.25rem)] shadow-md backface-hidden md:gap-1 md:p-2 ${
            isActive ? "ring-2 ring-green-400 md:ring-4" : ""
          }`}
          style={{ backfaceVisibility: "hidden" }}>
          {!isHidden && (
            <>
              <p className="ml-1">{rank}</p>
              <div className="w-[clamp(0.95rem,2.8vw,1.5rem)] h-[clamp(0.95rem,2.8vw,1.5rem)]">
                {symbol[suit]}
              </div>
            </>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute flex h-full w-full items-center justify-center rounded-lg border-4 border-white bg-blue-600 text-white shadow-md md:border-6"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}>
          <IconCherry className="h-[clamp(1.1rem,3vw,1.8rem)] w-[clamp(1.1rem,3vw,1.8rem)]" />
        </div>
      </div>
    </div>
  )
}

export default Card
