import React, { useRef, useEffect } from "react"
import rouletteImg from "@/assets/roulette0.png"
import { useRoulette } from "@/providers/RouletteProvider"
import { ROULETTE_0_ORDER } from "../rouletteConsts"
import gsap from "gsap"

const Roulette0SVG = () => {
  const { rouletteRef, spinData, WHEEL_OFFSET_DEG } = useRoulette()
  const ballRef = useRef(null)

  const SIZE = ROULETTE_0_ORDER.length
  const ANGLE_STEP = 360 / SIZE

  // 🎯 FIJO porque la ruleta es fija (max-w-74)
  const RADIUS = 145

  useEffect(() => {
    if (!spinData || !ballRef.current) return

    gsap.killTweensOf(ballRef.current)

    const spins = 3

    // 🔥 alineado con la ruleta
    const target = -(spinData.finalAngle - WHEEL_OFFSET_DEG)
    gsap.fromTo(
      ballRef.current,
      { rotation: 0 },
      {
        rotation: -(360 * spins) + target,
        duration: 3,
        ease: "power3.out",
      },
    )
  }, [spinData])
  return (
    <div className="relative mx-auto max-w-74">
      {/* 🎡 RULETA */}
      <img
        ref={rouletteRef}
        src={rouletteImg}
        alt="roulette"
        className="w-full h-auto origin-center"
      />

      {/* ⚪ BOLA */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={ballRef}
          className="absolute w-full h-full"
          style={{ transformOrigin: "50% 50%" }}>
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

      {/* 🔍 DEBUG PERFECTO ALINEADO AL MISMO SISTEMA */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(-5px, -6px)`, // 👈 ajuste fino visual
        }}>
        {ROULETTE_0_ORDER.map((num, i) => {
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
              }}>
              {num}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Roulette0SVG
