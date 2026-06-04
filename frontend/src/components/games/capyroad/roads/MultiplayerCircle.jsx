import React from "react"

const MultiplayerCircle = ({ text = "1.00x" }) => {
  return (
    <div className="multiplayer flex w-full items-center justify-center px-2">
      {/* círculo exterior */}
      <div className="relative flex aspect-square w-full max-w-24 items-center justify-center rounded-full border-2 border-stone-800 bg-stone-700 shadow-inner 2xl:max-w-28 2xl:border-4">
        {/* anillo interior */}
        <div className="absolute inset-2 rounded-full border-2 border-stone-500 opacity-40" />

        {/* textura tipo rejilla */}
        <div className="absolute inset-3 grid grid-cols-3 gap-0.5 opacity-20">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-black rounded-sm" />
          ))}
        </div>

        {/* texto multiplicador */}
        <span className="relative text-sm font-bold text-white md:text-base lg:text-lg">
          {text}
        </span>
      </div>
    </div>
  )
}

export default MultiplayerCircle
