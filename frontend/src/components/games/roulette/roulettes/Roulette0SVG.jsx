import React from "react"
import rouletteImg from "@/assets/roulette0.png"

const Roulette0SVG = () => {
  return (
    <div className="xs:max-w-30 sm:max-w-42 md:max-w-58 lg:max-w-66 xl:max-w-74">
      <img
        src={rouletteImg}
        alt="Roulette0"
        className="animate-spin [animation-duration:10s] origin-center"
      />
    </div>
  )
}

export default Roulette0SVG
