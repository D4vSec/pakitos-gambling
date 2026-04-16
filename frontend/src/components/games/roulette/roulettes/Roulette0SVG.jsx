import React, { useEffect, useRef } from "react"
import rouletteImg from "@/assets/roulette0.png"
import gsap from "gsap"

const Roulette0SVG = () => {
  const rouletteRef = useRef(null)

  useEffect(() => {
    gsap.to(rouletteRef.current, {
      rotation: 360,
      duration: 10,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    })
  }, [])

  return (
    <div className="xs:max-w-30 sm:max-w-42 md:max-w-58 lg:max-w-66 xl:max-w-74">
      <img ref={rouletteRef} src={rouletteImg} alt="Roulette0" />
    </div>
  )
}

export default Roulette0SVG
