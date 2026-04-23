import React from "react"

const MultiplayerCircle = ({ text = "1.00x" }) => {
  return (
    <div className="multiplayer flex items-center justify-center">
      {/* círculo exterior */}
      <div className="relative w-25 h-25 rounded-full bg-stone-700 shadow-inner border-4 border-stone-800 flex items-center justify-center">
        {/* anillo interior */}
        <div className="absolute inset-2 rounded-full border-2 border-stone-500 opacity-40" />

        {/* textura tipo rejilla */}
        <div className="absolute inset-3 grid grid-cols-3 gap-0.5 opacity-20">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-black rounded-sm" />
          ))}
        </div>

        {/* texto multiplicador */}
        <span className="relative text-xs font-bold text-white tracking-wide">
          {text}
        </span>
      </div>
    </div>
  )
}

export default MultiplayerCircle
