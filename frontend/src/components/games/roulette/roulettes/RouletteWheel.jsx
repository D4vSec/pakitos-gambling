import React, { useCallback, useRef, useEffect } from "react"
import roulette00 from "@/assets/games/roulette00.png"
import roulette0 from "@/assets/games/roulette0.png"
import { useRouletteAnimation } from "@/providers/rouletteContext"
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
const SPINNING_BALL_TOP_PERCENT = 5
const SPIN_DURATION = 3.2

const RouletteWheel = ({ type = "Zero" }) => {
  const { rouletteRef, spinData, settledNumber, handleFinish } = useRouletteAnimation()
  const ballRef = useRef(null)
  const ballDotRef = useRef(null)
  const spinTimelineRef = useRef(null)
  const wheelTweenRef = useRef(null)
  const lockedNumberRef = useRef(settledNumber)
  const syncLockedBallRef = useRef(null)
  const spinDataRef = useRef(spinData)
  const handleFinishRef = useRef(handleFinish)

  const config = WHEEL_CONFIG[type] || WHEEL_CONFIG.Zero
  const SIZE = config.order.length
  const ANGLE_STEP = 360 / SIZE
  const ORDER = config.order

  const getPocketAngle = useCallback(
    (number) => {
      const index = ORDER.indexOf(number)
      return Math.max(index, 0) * ANGLE_STEP + ANGLE_STEP / 2 + config.VISUAL_OFFSET
    },
    [ANGLE_STEP, ORDER, config.VISUAL_OFFSET],
  )

  const getRestingBallY = useCallback(() => {
    if (!ballRef.current) return 0

    const restingTopPercent =
      Number(getComputedStyle(ballRef.current).getPropertyValue("--roulette-ball-resting-top")) ||
      16
    const travelPercent = restingTopPercent - SPINNING_BALL_TOP_PERCENT
    return (ballRef.current.offsetHeight * travelPercent) / 100
  }, [])

  useEffect(() => {
    handleFinishRef.current = handleFinish
  }, [handleFinish])

  useEffect(() => {
    spinDataRef.current = spinData
  }, [spinData])

  const updateRestingBallRadius = useCallback(() => {
    if (spinDataRef.current || !ballDotRef.current) return

    gsap.set(ballDotRef.current, { y: getRestingBallY() })
  }, [getRestingBallY])

  const startWheelLoop = useCallback(() => {
    if (!rouletteRef.current) return

    gsap.killTweensOf(rouletteRef.current)
    gsap.set(rouletteRef.current, { transformOrigin: "50% 50%" })
    wheelTweenRef.current = gsap.to(rouletteRef.current, {
      rotation: "+=360",
      duration: IDLE_WHEEL_DURATION,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        syncLockedBallRef.current?.()
      },
    })
  }, [rouletteRef])

  const stopLockedBallSync = useCallback(() => {
    syncLockedBallRef.current = null
  }, [])

  const startLockedBallSync = useCallback(
    (number) => {
      if (!rouletteRef.current || !ballRef.current) return

      lockedNumberRef.current = number
      const pocketAngle = getPocketAngle(number)
      const syncBallToWheel = () => {
        if (!rouletteRef.current || !ballRef.current) return

        const wheelRotation = Number(gsap.getProperty(rouletteRef.current, "rotation")) || 0

        gsap.set(ballRef.current, {
          rotation: wheelRotation + pocketAngle,
          transformOrigin: "50% 50%",
        })
      }

      stopLockedBallSync()
      gsap.killTweensOf(ballRef.current)
      syncLockedBallRef.current = syncBallToWheel
      syncBallToWheel()
    },
    [getPocketAngle, rouletteRef, stopLockedBallSync],
  )

  useEffect(() => {
    if (!rouletteRef.current) return

    const wheel = rouletteRef.current
    startWheelLoop()

    return () => {
      gsap.killTweensOf(wheel)
      wheelTweenRef.current = null
      stopLockedBallSync()
    }
  }, [rouletteRef, startWheelLoop, stopLockedBallSync, type])

  useEffect(() => {
    if (!ballRef.current) return

    const ball = ballRef.current
    const refreshBallPosition = () => {
      if (spinDataRef.current) return

      updateRestingBallRadius()
      startLockedBallSync(lockedNumberRef.current)
    }
    const resizeObserver = new ResizeObserver(refreshBallPosition)

    resizeObserver.observe(ball)
    window.addEventListener("resize", refreshBallPosition)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", refreshBallPosition)
    }
  }, [startLockedBallSync, updateRestingBallRadius])

  useEffect(() => {
    if (spinData || !ballRef.current || !ballDotRef.current) return

    const ball = ballRef.current
    const ballDot = ballDotRef.current

    gsap.killTweensOf(ballDot)
    updateRestingBallRadius()
    startLockedBallSync(settledNumber)

    return () => {
      gsap.killTweensOf(ball)
      stopLockedBallSync()
    }
  }, [settledNumber, spinData, startLockedBallSync, stopLockedBallSync, updateRestingBallRadius])

  useEffect(() => {
    if (!spinData || !rouletteRef.current || !ballRef.current || !ballDotRef.current) return

    const wheel = rouletteRef.current
    const ball = ballRef.current
    const ballDot = ballDotRef.current
    const ballSpins = 6
    const currentWheelRotation = Number(gsap.getProperty(wheel, "rotation")) || 0
    const currentBallRotation = Number(gsap.getProperty(ball, "rotation")) || 0
    const winningPocketAngle = getPocketAngle(spinData.winningNumber)
    const predictedWheelRotation = currentWheelRotation + IDLE_ROTATION_SPEED * SPIN_DURATION
    const finalBallRotation = predictedWheelRotation + winningPocketAngle - 360 * ballSpins

    gsap.killTweensOf(ball)
    gsap.killTweensOf(ballDot)
    stopLockedBallSync()
    if (spinTimelineRef.current) {
      spinTimelineRef.current.kill()
    }

    gsap.set(ballDot, { y: 0 })
    gsap.set(ball, { transformOrigin: "50% 50%" })

    const timeline = gsap.timeline({
      onComplete: () => {
        if (rouletteRef.current && ballRef.current) {
          const wheelRotation = Number(gsap.getProperty(rouletteRef.current, "rotation")) || 0

          gsap.set(ballRef.current, {
            rotation: wheelRotation + winningPocketAngle,
            transformOrigin: "50% 50%",
          })
        }
        startLockedBallSync(spinData.winningNumber)
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
          y: getRestingBallY,
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
    getRestingBallY,
    rouletteRef,
    spinData,
    startLockedBallSync,
    stopLockedBallSync,
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
          className="absolute w-full h-full [--roulette-ball-resting-top:16] sm:[--roulette-ball-resting-top:19] md:[--roulette-ball-resting-top:17] lg:[--roulette-ball-resting-top:17.4] xl:[--roulette-ball-resting-top:18.8] 2xl:[--roulette-ball-resting-top:18.8]"
          style={{ transformOrigin: "50% 50%" }}
        >
          <div
            ref={ballDotRef}
            className="absolute w-[clamp(0.5rem,2.5vmin,0.75rem)] h-[clamp(0.5rem,2.5vmin,0.75rem)] bg-white rounded-full shadow-md"
            style={{
              top: SPINNING_BALL_TOP,
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(RouletteWheel)
