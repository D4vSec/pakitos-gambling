import React, { useRef, useEffect } from "react"
import roulette00 from "@/assets/games/roulette00.png"
import roulette0 from "@/assets/games/roulette0.png"
import { useRoulette } from "@/providers/RouletteProvider"
import { ROULETTE_0_ORDER, ROULETTE_00_ORDER } from "../rouletteConsts"
import gsap from "gsap"

const RouletteWheel = ({ type = "Zero", debug }) => {
  const { rouletteRef, spinData } = useRoulette()
  const ballRef = useRef(null)

  const config = {
    Zero: {
      image: roulette0,
      order: ROULETTE_0_ORDER,
      VISUAL_OFFSET: -5,
    },
    ZeroZero: {
      image: roulette00,
      order: ROULETTE_00_ORDER,
      VISUAL_OFFSET: -5,
    },
  }

  const SIZE = config[type]?.order.length || 0
  const ANGLE_STEP = 360 / SIZE
  const RADIUS = 100 // 145

  const ORDER = config[type]?.order || []

  useEffect(() => {
    if (!spinData || !ballRef.current) return
    gsap.killTweensOf(ballRef.current)
    const spins = 6
    const anglePerSlot = 360 / ORDER.length || 0
    const index = ORDER.indexOf(spinData.winningNumber) || 0
    const targetAngle =
      index * anglePerSlot + anglePerSlot / 2 + spinData.randomOffset + config[type]?.VISUAL_OFFSET

    gsap.fromTo(
      ballRef.current,
      { rotation: 0 },
      {
        rotation: -(360 * spins) + targetAngle,
        duration: 3,
        ease: "power3.out",
      },
    )
  }, [spinData])

  return (
    <div className="relative mx-auto max-w-74">
      <img
        ref={rouletteRef}
        src={config[type]?.image || roulette0}
        alt="roulette"
        className="w-full h-auto origin-center"
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={ballRef}
          className="absolute w-full h-full"
          style={{ transformOrigin: "50% 50%" }}
        >
          <div
            className="absolute w-3 h-3 bg-white rounded-full shadow-md"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -${RADIUS}px)`,
            }}
          />
        </div>
      </div>
      {debug && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(-5px, -6px)`, 
          }}
        >
          {ORDER.map((num, i) => {
            const angle = i * ANGLE_STEP

            return (
              <div
                key={num}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `
            rotate(${angle}deg)
            translateY(-140px)
            rotate(-${angle}deg)
          `,
                  fontSize: "9px",
                  color: "white",
                }}
              >
                {num}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RouletteWheel
