import React, { useCallback, useRef, useEffect } from "react"
import roulette00 from "@/assets/games/roulette00.png"
import roulette0 from "@/assets/games/roulette0.png"
import { useRoulette } from "@/providers/RouletteProvider"
import { ROULETTE_0_ORDER, ROULETTE_00_ORDER } from "../rouletteConsts"
import gsap from "gsap"

const WHEEL_CONFIG = {
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

const IDLE_WHEEL_DURATION = 14.4
const IDLE_ROTATION_SPEED = 360 / IDLE_WHEEL_DURATION
const SPINNING_BALL_TOP = "5%"
const RESTING_BALL_TOP = "16%"
const SPIN_DURATION = 3.2

const RouletteWheel = ({ type = "Zero" }) => {
  const { rouletteRef, spinData, settledNumber, handleFinish } = useRoulette()
  const ballRef = useRef(null)
  const ballDotRef = useRef(null)
  const spinTimelineRef = useRef(null)
  const handleFinishRef = useRef(handleFinish)

  const config = WHEEL_CONFIG[type] || WHEEL_CONFIG.Zero
  const SIZE = config.order.length
  const ANGLE_STEP = 360 / SIZE
  const ORDER = config.order

  const getPocketAngle = useCallback(
    (number) => {
      const index = ORDER.indexOf(number)
      return (
        Math.max(index, 0) * ANGLE_STEP + ANGLE_STEP / 2 + config.VISUAL_OFFSET
      )
    },
    [ANGLE_STEP, ORDER, config.VISUAL_OFFSET],
  )

  useEffect(() => {
    handleFinishRef.current = handleFinish
  }, [handleFinish])

  const startWheelLoop = useCallback(() => {
    if (!rouletteRef.current) return

    gsap.killTweensOf(rouletteRef.current)
    gsap.set(rouletteRef.current, { transformOrigin: "50% 50%" })
    gsap.to(rouletteRef.current, {
      rotation: "+=360",
      duration: IDLE_WHEEL_DURATION,
      ease: "none",
      repeat: -1,
    })
  }, [rouletteRef])

  const startLockedBallLoop = useCallback(
    (number) => {
      if (!rouletteRef.current || !ballRef.current) return

      const wheelRotation =
        Number(gsap.getProperty(rouletteRef.current, "rotation")) || 0
      const pocketAngle = getPocketAngle(number)

      gsap.killTweensOf(ballRef.current)
      gsap.set(ballRef.current, {
        rotation: wheelRotation + pocketAngle,
        transformOrigin: "50% 50%",
      })
      gsap.to(ballRef.current, {
        rotation: "+=360",
        duration: IDLE_WHEEL_DURATION,
        ease: "none",
        repeat: -1,
      })
    },
    [getPocketAngle, rouletteRef],
  )

  useEffect(() => {
    if (!rouletteRef.current) return

    const wheel = rouletteRef.current
    startWheelLoop()

    return () => {
      gsap.killTweensOf(wheel)
    }
  }, [rouletteRef, startWheelLoop, type])

  useEffect(() => {
    if (spinData || !ballRef.current || !ballDotRef.current) return

    const ball = ballRef.current
    const ballDot = ballDotRef.current

    gsap.killTweensOf(ballDot)
    gsap.set(ballDot, { top: RESTING_BALL_TOP })
    startLockedBallLoop(settledNumber)

    return () => {
      gsap.killTweensOf(ball)
    }
  }, [settledNumber, spinData, startLockedBallLoop])

  useEffect(() => {
    if (
      !spinData ||
      !rouletteRef.current ||
      !ballRef.current ||
      !ballDotRef.current
    )
      return

    const wheel = rouletteRef.current
    const ball = ballRef.current
    const ballDot = ballDotRef.current
    const ballSpins = 6
    const currentWheelRotation =
      Number(gsap.getProperty(wheel, "rotation")) || 0
    const currentBallRotation = Number(gsap.getProperty(ball, "rotation")) || 0
    const winningPocketAngle = getPocketAngle(spinData.winningNumber)
    const predictedWheelRotation =
      currentWheelRotation + IDLE_ROTATION_SPEED * SPIN_DURATION
    const finalBallRotation =
      predictedWheelRotation + winningPocketAngle - 360 * ballSpins

    gsap.killTweensOf(ball)
    gsap.killTweensOf(ballDot)
    if (spinTimelineRef.current) {
      spinTimelineRef.current.kill()
    }

    gsap.set(ballDot, { top: SPINNING_BALL_TOP })
    gsap.set(ball, { transformOrigin: "50% 50%" })

    const timeline = gsap.timeline({
      onComplete: () => {
        if (rouletteRef.current && ballRef.current) {
          const wheelRotation =
            Number(gsap.getProperty(rouletteRef.current, "rotation")) || 0

          gsap.set(ballRef.current, {
            rotation: wheelRotation + winningPocketAngle,
            transformOrigin: "50% 50%",
          })
        }
        startLockedBallLoop(spinData.winningNumber)
        handleFinishRef.current()
      },
    })

    spinTimelineRef.current = timeline

    timeline
      .fromTo(
        ball,
        { rotation: currentBallRotation },
        {
          rotation: finalBallRotation,
          duration: SPIN_DURATION,
          ease: "power3.out",
        },
        0,
      )
      .to(
        ballDot,
        {
          top: RESTING_BALL_TOP,
          duration: SPIN_DURATION,
          ease: "power2.out",
        },
        0,
      )

    return () => {
      timeline.kill()
    }
  }, [
    getPocketAngle,
    rouletteRef,
    spinData,
    startLockedBallLoop,
    startWheelLoop,
  ])

  return (
    <div className="relative mx-auto aspect-square w-[min(72vmin,20rem)] max-h-full max-w-full sm:w-full sm:max-w-56 md:max-w-64 lg:max-w-74">
      <img
        ref={rouletteRef}
        src={config.image}
        alt="roulette"
        className="w-full h-auto origin-center"
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={ballRef}
          className="absolute w-full h-full"
          style={{ transformOrigin: "50% 50%" }}>
          <div
            ref={ballDotRef}
            className="absolute w-[clamp(0.5rem,2.5vmin,0.75rem)] h-[clamp(0.5rem,2.5vmin,0.75rem)] bg-white rounded-full shadow-md"
            style={{
              top: RESTING_BALL_TOP,
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default RouletteWheel
