import React, { useEffect, useMemo, useRef } from "react"
import gsap from "gsap"
import Road from "./roads/Road"
import Capybara from "./Capybara"
import SidewalkStart from "./SidewalkStart"
import ducksImg from "@/assets/games/ducks.png"
import brokenScreenImg from "@/assets/games/brokenScreen.png"
import ufoImg from "@/assets/games/gatovni.png"
import { useCapyroad } from "@/providers/CapyroadProvider"
import { useLocale } from "@/providers/LocaleProvider"
import { useState } from "react"

const VISIBLE_ROADS = 5
const CAMERA_OFFSET = 2

const FALLBACK_MULTIPLIERS = Array.from({ length: 10 }, (_, index) => {
  if (index === 0) return 1

  const progress = index / 9
  const nextMultiplier = 1 + (3 - 1) * Math.pow(progress, 0.85)
  return Math.round(nextMultiplier * 100) / 100
})

const Capyroad = () => {
  const viewportRef = useRef(null)
  const boardRef = useRef(null)
  const capybaraRef = useRef(null)
  const ducksRef = useRef(null)
  const brokenScreenRef = useRef(null)
  const ufoRef = useRef(null)
  const beamRef = useRef(null)
  const previousRoadRef = useRef(null)
  const previousVisiblePositionRef = useRef(0)
  const animationRef = useRef(null)
  const crashDelayRef = useRef(null)
  const winDelayRef = useRef(null)
  const finishedCrashGameRef = useRef(null)
  const finishedWinGameRef = useRef(null)
  const crashAnimationQueuedRef = useRef(false)
  const crashAnimationRunningRef = useRef(false)
  const winAnimationQueuedRef = useRef(false)
  const winAnimationRunningRef = useRef(false)
  const { game, finishGame, setOutcomeAnimationRunning } = useCapyroad()
  const latestGameRef = useRef(game)
  const finishGameRef = useRef(finishGame)
  const { t } = useLocale()
  const hasActiveGame = Boolean(game?.gameId)
  const [renderWindowStart, setRenderWindowStart] = useState(0)

  const multipliers = useMemo(() => {
    if (Array.isArray(game?.info?.multipliers) && game.info.multipliers.length > 0) {
      return game.info.multipliers
    }

    return FALLBACK_MULTIPLIERS
  }, [game?.info?.multipliers])

  const currentRoad = Math.min(
    Number(game?.info?.road || 0),
    Math.max(multipliers.length - 1, 0),
  )
  const payoutMultiplier = Number(
    game?.info?.payoutMultiplier || multipliers[currentRoad] || 1,
  )
  const payout = Number(game?.payout || 0)
  const crashProbability = Number(game?.info?.crashProbability || 0)
  const isCrashed = Boolean(game?.info?.isCrashed)
  const isCrashSequence = Boolean(game?.status === "finished" && isCrashed)
  const isWinSequence = Boolean(game?.status === "finished" && !isCrashed)
  const maxWindowStart = Math.max(multipliers.length - VISIBLE_ROADS, 0)
  const showStartSidewalk = renderWindowStart === 0
  const visibleRoadSlots = showStartSidewalk ? VISIBLE_ROADS - 1 : VISIBLE_ROADS
  const desiredWindowStart = hasActiveGame
    ? Math.min(Math.max(currentRoad - CAMERA_OFFSET, 0), maxWindowStart)
    : 0
  const hasHiddenNextRoad = renderWindowStart < maxWindowStart
  const renderedRoads = multipliers
    .slice(
      renderWindowStart,
      renderWindowStart + visibleRoadSlots + (hasHiddenNextRoad ? 1 : 0),
    )
    .map((multiplier, offset) => {
      const actualIndex = renderWindowStart + offset

      return {
        actualIndex,
        multiplier,
      }
    })
  const visiblePosition = Math.min(
    Math.max(currentRoad - renderWindowStart, 0),
    visibleRoadSlots - 1,
  )
  const sidewalkWidthPercent = 100 / VISIBLE_ROADS
  const boardLeftPercent = showStartSidewalk ? sidewalkWidthPercent : 0
  const boardWidthPercent =
    (renderedRoads.length / visibleRoadSlots) * (100 - boardLeftPercent)

  useEffect(() => {
    latestGameRef.current = game
    finishGameRef.current = finishGame
  }, [finishGame, game])

  useEffect(() => {
    if (!hasActiveGame && renderWindowStart !== 0) {
      const frameId = requestAnimationFrame(() => {
        setRenderWindowStart(0)
      })

      return () => cancelAnimationFrame(frameId)
    }
  }, [hasActiveGame, renderWindowStart])

  useEffect(() => {
    if (
      !viewportRef.current ||
      !boardRef.current ||
      !capybaraRef.current ||
      !ducksRef.current ||
      !brokenScreenRef.current ||
      !ufoRef.current ||
      !beamRef.current ||
      renderedRoads.length === 0
    ) {
      return
    }

    if (isWinSequence) {
      return
    }

    const viewportWidth = viewportRef.current.clientWidth
    const laneWidth = viewportWidth / VISIBLE_ROADS
    const roadOffset = showStartSidewalk ? laneWidth : 0
    const finalRoadOffset = desiredWindowStart === 0 ? laneWidth : 0
    const spriteWidth = capybaraRef.current.offsetWidth || 0
    const ducksWidth = ducksRef.current.offsetWidth || 0
    const ducksHeight = ducksRef.current.offsetHeight || 0
    const sidewalkX = laneWidth * 0.18
    const previousRoad = previousRoadRef.current
    const previousVisiblePosition = previousVisiblePositionRef.current
    const targetX =
      roadOffset + laneWidth * visiblePosition + laneWidth / 2 - spriteWidth / 2
    const isOpeningJump = hasActiveGame && previousRoad === null && currentRoad === 0
    const shouldShiftCamera =
      hasActiveGame &&
      previousRoad !== null &&
      currentRoad > previousRoad &&
      desiredWindowStart > renderWindowStart

    gsap.killTweensOf(capybaraRef.current)
    gsap.killTweensOf(boardRef.current)
    gsap.killTweensOf(ducksRef.current)
    gsap.killTweensOf(viewportRef.current)
    gsap.killTweensOf(brokenScreenRef.current)
    gsap.killTweensOf(ufoRef.current)
    gsap.killTweensOf(beamRef.current)
    animationRef.current?.kill()

    if (!hasActiveGame) {
      gsap.set(capybaraRef.current, {
        x: sidewalkX,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
      })
      gsap.set(boardRef.current, { x: 0 })
      gsap.set(ducksRef.current, {
        x: -ducksWidth,
        y: -ducksHeight,
        opacity: 0,
        rotation: 0,
      })
      gsap.set(brokenScreenRef.current, { opacity: 0 })
      gsap.set(ufoRef.current, { opacity: 0 })
      gsap.set(beamRef.current, { opacity: 0, scaleY: 0.2 })
      if (renderWindowStart !== desiredWindowStart) {
        requestAnimationFrame(() => {
          setRenderWindowStart(desiredWindowStart)
        })
      }
    } else if (isOpeningJump) {
      const jumpHeight = Math.min(88, Math.max(52, laneWidth * 0.55))

      animationRef.current = gsap
        .timeline()
        .set(capybaraRef.current, {
          x: sidewalkX,
          y: 0,
          rotation: -4,
          scaleX: 0.96,
          scaleY: 1.04,
          opacity: 1,
        })
        .to(capybaraRef.current, {
          duration: 0.14,
          scaleX: 1.08,
          scaleY: 0.9,
          ease: "power1.out",
        })
        .to(
          capybaraRef.current,
          {
            duration: 0.4,
            x: targetX,
            y: -jumpHeight,
            rotation: 8,
            ease: "power2.out",
          },
          0,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.42,
            y: 0,
            rotation: 0,
            ease: "bounce.out",
          },
          0.18,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.18,
            scaleX: 1,
            scaleY: 1,
            ease: "power2.out",
          },
          0.34,
        )
    } else if (previousRoad === null || currentRoad <= previousRoad) {
      gsap.set(capybaraRef.current, {
        x: targetX,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
      })
      gsap.set(boardRef.current, { x: 0 })
      gsap.set(ducksRef.current, {
        x: -ducksWidth,
        y: -ducksHeight,
        opacity: 0,
        rotation: 0,
      })
      gsap.set(brokenScreenRef.current, { opacity: 0 })
      gsap.set(ufoRef.current, { opacity: 0 })
      gsap.set(beamRef.current, { opacity: 0, scaleY: 0.2 })
    } else {
      const startX =
        roadOffset + laneWidth * previousVisiblePosition + laneWidth / 2 - spriteWidth / 2
      const jumpTargetPosition = Math.min(
        currentRoad - renderWindowStart,
        visibleRoadSlots - 1,
      )
      const jumpTargetX =
        roadOffset + laneWidth * jumpTargetPosition + laneWidth / 2 - spriteWidth / 2
      const finalVisiblePosition = Math.min(
        currentRoad - desiredWindowStart,
        desiredWindowStart === 0 ? VISIBLE_ROADS - 2 : VISIBLE_ROADS - 1,
      )
      const finalTargetX =
        finalRoadOffset +
        laneWidth * finalVisiblePosition +
        laneWidth / 2 -
        spriteWidth / 2
      const jumpHeight = Math.min(88, Math.max(52, laneWidth * 0.55))
      animationRef.current = gsap
        .timeline({
          onComplete: () => {
            if (shouldShiftCamera) {
              setRenderWindowStart(desiredWindowStart)
            }

            gsap.set(boardRef.current, { x: 0 })
            gsap.set(capybaraRef.current, {
              x: shouldShiftCamera ? finalTargetX : jumpTargetX,
              y: 0,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
              opacity: 1,
            })
            gsap.set(ducksRef.current, {
              x: -ducksWidth,
              y: -ducksHeight,
              opacity: 0,
              rotation: 0,
              scale: 1,
            })
            gsap.set(brokenScreenRef.current, { opacity: 0 })
            gsap.set(ufoRef.current, { opacity: 0 })
            gsap.set(beamRef.current, { opacity: 0, scaleY: 0.2 })
          },
        })
        .set(capybaraRef.current, {
          x: startX,
          y: 0,
          rotation: -2,
          scaleX: 0.96,
          scaleY: 1.04,
        })
        .to(capybaraRef.current, {
          duration: 0.14,
          scaleX: 1.08,
          scaleY: 0.9,
          ease: "power1.out",
        })
        .to(
          capybaraRef.current,
          {
            duration: 0.36,
            x: jumpTargetX,
            y: -jumpHeight,
            rotation: 6,
            ease: "power2.out",
          },
          0,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.4,
            y: 0,
            rotation: 0,
            ease: "bounce.out",
          },
          0.18,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.18,
            scaleX: 1,
            scaleY: 1,
            ease: "power2.out",
          },
          0.34,
        )
      gsap.set(ducksRef.current, {
        x: -ducksWidth,
        y: -ducksHeight,
        opacity: 0,
        rotation: 0,
        scale: 1,
      })
      gsap.set(brokenScreenRef.current, { opacity: 0 })
      gsap.set(ufoRef.current, { opacity: 0 })
      gsap.set(beamRef.current, { opacity: 0, scaleY: 0.2 })

      if (shouldShiftCamera) {
        animationRef.current.to(
          boardRef.current,
          {
            duration: 0.28,
            x: -laneWidth,
            ease: "power2.inOut",
          },
          0.28,
        )
        animationRef.current.to(
          capybaraRef.current,
          {
            duration: 0.28,
            x: finalTargetX,
            ease: "power2.inOut",
          },
          0.28,
        )
      }
    }

    previousRoadRef.current = currentRoad
    previousVisiblePositionRef.current = shouldShiftCamera
      ? Math.min(
          currentRoad - desiredWindowStart,
          desiredWindowStart === 0 ? VISIBLE_ROADS - 2 : VISIBLE_ROADS - 1,
        )
      : visiblePosition
  }, [
    currentRoad,
    desiredWindowStart,
    hasActiveGame,
    isCrashSequence,
    isWinSequence,
    renderWindowStart,
    renderedRoads.length,
    showStartSidewalk,
    visibleRoadSlots,
    visiblePosition,
  ])

  useEffect(() => {
    if (
      !isCrashSequence ||
      crashAnimationQueuedRef.current ||
      crashAnimationRunningRef.current ||
      !viewportRef.current ||
      !boardRef.current ||
      !capybaraRef.current ||
      !ducksRef.current ||
      !game?.gameId ||
      finishedCrashGameRef.current === game.gameId
    ) {
      return
    }

    setOutcomeAnimationRunning(true)

    const startCrashAnimation = () => {
      if (
        !viewportRef.current ||
        !capybaraRef.current ||
        !ducksRef.current ||
        !brokenScreenRef.current ||
        !ufoRef.current ||
        !beamRef.current ||
        finishedCrashGameRef.current === game.gameId
      ) {
        crashAnimationQueuedRef.current = false
        return
      }

      const viewportWidth = viewportRef.current.clientWidth
      const viewportHeight = viewportRef.current.clientHeight
      const spriteWidth = capybaraRef.current.offsetWidth || 0
      const spriteHeight = capybaraRef.current.offsetHeight || spriteWidth
      const ducksWidth = ducksRef.current.offsetWidth || 0
      const ducksHeight = ducksRef.current.offsetHeight || 0
      const currentX = Number(gsap.getProperty(capybaraRef.current, "x")) || 0
      const ducksImpactX = currentX + spriteWidth / 2 - ducksWidth / 2
      const ducksImpactY = Math.max(24, viewportHeight - ducksHeight - 70)
      const closeUpScale =
        Math.max(viewportWidth / Math.max(spriteWidth, 1), viewportHeight / Math.max(spriteHeight, 1)) *
        1.32
      const screenImpactX =
        viewportWidth / 2 - (spriteWidth * closeUpScale) / 2 + viewportWidth * 0.20
      const screenImpactY = -viewportHeight * 0.10
      const capybaraFallX = screenImpactX + viewportWidth * 0.06
      const capybaraFallY = viewportHeight * 0.8

      crashAnimationQueuedRef.current = false
      crashAnimationRunningRef.current = true
      gsap.killTweensOf(capybaraRef.current)
      gsap.killTweensOf(boardRef.current)
      gsap.killTweensOf(ducksRef.current)
      gsap.killTweensOf(viewportRef.current)
      gsap.killTweensOf(brokenScreenRef.current)
      gsap.killTweensOf(ufoRef.current)
      gsap.killTweensOf(beamRef.current)
      animationRef.current?.kill()

      animationRef.current = gsap
        .timeline({
          onComplete: async () => {
            crashAnimationRunningRef.current = false
            const latestGame = latestGameRef.current

            if (
              latestGame?.gameId &&
              finishedCrashGameRef.current !== latestGame.gameId
            ) {
              finishedCrashGameRef.current = latestGame.gameId
              await finishGameRef.current(latestGame)
            }
          },
        })
        .set(capybaraRef.current, {
          x: currentX,
          y: 0,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          transformOrigin: "50% 50%",
        })
        .set(boardRef.current, { x: 0 })
        .set(viewportRef.current, { x: 0, y: 0 })
        .set(brokenScreenRef.current, { opacity: 0, scale: 1.02 })
        .set(ufoRef.current, { opacity: 0 })
        .set(beamRef.current, { opacity: 0, scaleY: 0.2 })
        .set(ducksRef.current, {
          x: ducksImpactX,
          y: -ducksHeight - 56,
          opacity: 0,
          rotation: -12,
          scale: 0.72,
        })
        .to(ducksRef.current, {
          duration: 0.14,
          opacity: 1,
          ease: "power1.out",
        })
        .to(
          ducksRef.current,
          {
            duration: 0.2,
            x: ducksImpactX - 10,
            y: ducksImpactY * 0.32,
            rotation: -10,
            scale: 0.78,
            ease: "power1.in",
          },
          0,
        )
        .to(
          ducksRef.current,
          {
            duration: 0.2,
            x: ducksImpactX + 10,
            y: ducksImpactY * 0.66,
            rotation: 10,
            scale: 0.88,
            ease: "sine.inOut",
          },
          0.2,
        )
        .to(
          ducksRef.current,
          {
            duration: 0.22,
            x: ducksImpactX,
            y: ducksImpactY,
            rotation: 0,
            scale: 1,
            ease: "power2.in",
          },
          0.4,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.1,
            x: currentX + 12,
            y: 2,
            rotation: 10,
            scaleX: 0.9,
            scaleY: 1.1,
            ease: "power1.in",
          },
          0.62,
        )
        .to(
          ducksRef.current,
          {
            duration: 0.08,
            x: ducksImpactX + 12,
            y: ducksImpactY + 3,
            rotation: 5,
            ease: "none",
          },
          0.62,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.34,
            x: screenImpactX,
            y: screenImpactY,
            rotation: 14,
            scaleX: closeUpScale,
            scaleY: closeUpScale,
            ease: "power3.out",
          },
          0.72,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.12,
            x: screenImpactX - viewportWidth * 0.025,
            y: screenImpactY + viewportHeight * 0.015,
            rotation: -8,
            scaleX: closeUpScale * 1.14,
            scaleY: closeUpScale * 0.84,
            ease: "power1.in",
          },
          1.06,
        )
        .to(
          brokenScreenRef.current,
          {
            duration: 0.04,
            opacity: 0.92,
            scale: 1,
            ease: "power1.out",
          },
          1.08,
        )
        .to(
          viewportRef.current,
          {
            duration: 0.06,
            x: -10,
            y: 6,
            repeat: 3,
            yoyo: true,
            ease: "none",
          },
          1.08,
        )
        .to(
          brokenScreenRef.current,
          {
            duration: 0.22,
            opacity: 0.88,
            ease: "none",
          },
          1.12,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.42,
            x: capybaraFallX,
            y: capybaraFallY,
            rotation: 68,
            scaleX: closeUpScale * 0.9,
            scaleY: closeUpScale * 0.9,
            opacity: 0,
            ease: "power2.in",
          },
          1.2,
        )
        .to(
          brokenScreenRef.current,
          {
            duration: 0.18,
            opacity: 0,
            ease: "power1.out",
          },
          1.42,
        )
        .to(
          ducksRef.current,
          {
            duration: 0.2,
            x: ducksImpactX + 20,
            y: ducksImpactY + 16,
            rotation: 8,
            ease: "power1.out",
          },
          0.72,
        )
        .to(
          ducksRef.current,
          {
            duration: 0.18,
            opacity: 0,
            ease: "power1.out",
          },
          1.18,
        )
    }

    const activeAnimation = animationRef.current
    const remainingAnimationTime =
      activeAnimation && typeof activeAnimation.totalDuration === "function"
        ? Math.max(activeAnimation.totalDuration() - activeAnimation.time(), 0)
        : 0

    if (remainingAnimationTime > 0.06) {
      crashAnimationQueuedRef.current = true
      crashDelayRef.current?.kill()
      crashDelayRef.current = gsap.delayedCall(remainingAnimationTime + 0.02, startCrashAnimation)
      return () => {
        crashDelayRef.current?.kill()
        crashDelayRef.current = null
        crashAnimationQueuedRef.current = false
      }
    }

    startCrashAnimation()
  }, [game?.gameId, isCrashSequence, setOutcomeAnimationRunning, showStartSidewalk, visiblePosition])

  useEffect(() => {
    if (
      !isWinSequence ||
      winAnimationQueuedRef.current ||
      winAnimationRunningRef.current ||
      !viewportRef.current ||
      !boardRef.current ||
      !capybaraRef.current ||
      !ufoRef.current ||
      !beamRef.current ||
      !ducksRef.current ||
      !brokenScreenRef.current ||
      !game?.gameId ||
      finishedWinGameRef.current === game.gameId
    ) {
      return
    }

    setOutcomeAnimationRunning(true)

    const startWinAnimation = () => {
      if (
        !viewportRef.current ||
        !capybaraRef.current ||
        !ufoRef.current ||
        !beamRef.current ||
        finishedWinGameRef.current === game.gameId
      ) {
        winAnimationQueuedRef.current = false
        return
      }

      const viewportWidth = viewportRef.current.clientWidth
      const viewportHeight = viewportRef.current.clientHeight
      const spriteWidth = capybaraRef.current.offsetWidth || 0
      const ufoWidth = ufoRef.current.offsetWidth || 0
      const ufoHeight = ufoRef.current.offsetHeight || 0
      const currentX = Number(gsap.getProperty(capybaraRef.current, "x")) || 0
      const currentY = Number(gsap.getProperty(capybaraRef.current, "y")) || 0
      const ufoCenterX = currentX + spriteWidth / 2 - ufoWidth / 2
      const ufoStartX = ufoCenterX
      const ufoStartY = -ufoHeight - 32
      const ufoHoverX = ufoCenterX
      const ufoHoverY = ufoHeight * 0.16
      const beamWidth = Math.max(spriteWidth * 2.5, ufoWidth * 0.6)
      const beamX = ufoHoverX + ufoWidth / 2 - beamWidth / 2
      const beamY = ufoHoverY + ufoHeight * 0.5
      const beamHeight = Math.max(120, viewportHeight - beamY - 18)
      const abductX = beamX + beamWidth / 2 - spriteWidth / 2 + spriteWidth * 0.04
      const abductY = ufoHoverY + ufoHeight * 0.42
      const ufoCarryX = ufoHoverX + viewportWidth * 0.08
      const ufoCarryY = -ufoHeight * 0.78

      winAnimationQueuedRef.current = false
      winAnimationRunningRef.current = true
      gsap.killTweensOf(capybaraRef.current)
      gsap.killTweensOf(boardRef.current)
      gsap.killTweensOf(ducksRef.current)
      gsap.killTweensOf(viewportRef.current)
      gsap.killTweensOf(brokenScreenRef.current)
      gsap.killTweensOf(ufoRef.current)
      gsap.killTweensOf(beamRef.current)
      animationRef.current?.kill()

      animationRef.current = gsap
        .timeline({
          onComplete: async () => {
            winAnimationRunningRef.current = false
            const latestGame = latestGameRef.current

            if (latestGame?.gameId && finishedWinGameRef.current !== latestGame.gameId) {
              finishedWinGameRef.current = latestGame.gameId
              await finishGameRef.current(latestGame)
            }
          },
        })
        .set(capybaraRef.current, {
          x: currentX,
          y: currentY,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
        })
        .set(boardRef.current, { x: 0 })
        .set(viewportRef.current, { x: 0, y: 0 })
        .set(brokenScreenRef.current, { opacity: 0, scale: 1 })
        .set(ducksRef.current, { opacity: 0 })
        .set(beamRef.current, {
          x: beamX,
          y: beamY,
          width: beamWidth,
          height: beamHeight,
          opacity: 0,
          scaleY: 0.15,
          transformOrigin: "50% 0%",
        })
        .set(ufoRef.current, {
          x: ufoStartX,
          y: ufoStartY,
          opacity: 0,
          rotation: -4,
          scale: 0.86,
          transformOrigin: "50% 50%",
        })
        .to(ufoRef.current, {
          duration: 0.14,
          opacity: 1,
          ease: "power1.out",
        })
        .to(
          ufoRef.current,
          {
            duration: 0.48,
            x: ufoHoverX,
            y: ufoHoverY,
            rotation: 0,
            scale: 1,
            ease: "power2.out",
          },
          0,
        )
        .to(
          beamRef.current,
          {
            duration: 0.16,
            opacity: 0.92,
            scaleY: 1,
            ease: "power1.out",
          },
          0.3,
        )
        .to(
          ufoRef.current,
          {
            duration: 0.18,
            y: ufoHoverY - 10,
            rotation: 2,
            ease: "sine.inOut",
          },
          0.34,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.16,
            x: currentX + spriteWidth * 0.02,
            y: currentY - 18,
            rotation: 4,
            scaleX: 0.96,
            scaleY: 0.96,
            ease: "power1.out",
          },
          0.38,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.44,
            x: abductX,
            y: abductY,
            rotation: 0,
            scaleX: 0.56,
            scaleY: 0.56,
            opacity: 0.45,
            ease: "power2.in",
          },
          0.5,
        )
        .to(
          capybaraRef.current,
          {
            duration: 0.18,
            x: abductX + spriteWidth * 0.02,
            y: abductY - ufoHeight * 0.08,
            scaleX: 0.22,
            scaleY: 0.22,
            opacity: 0,
            ease: "power1.in",
          },
          0.82,
        )
        .to(
          beamRef.current,
          {
            duration: 0.2,
            opacity: 0,
            scaleY: 0.1,
            ease: "power1.out",
          },
          0.88,
        )
        .to(
          ufoRef.current,
          {
            duration: 0.52,
            x: ufoCarryX,
            y: ufoCarryY,
            rotation: -6,
            ease: "power2.in",
          },
          0.92,
        )
        .to(
          ufoRef.current,
          {
            duration: 0.18,
            opacity: 0,
            ease: "power1.out",
          },
          1.22,
        )
    }

    const activeAnimation = animationRef.current
    const remainingAnimationTime =
      activeAnimation && typeof activeAnimation.totalDuration === "function"
        ? Math.max(activeAnimation.totalDuration() - activeAnimation.time(), 0)
        : 0

    if (remainingAnimationTime > 0.06) {
      winAnimationQueuedRef.current = true
      winDelayRef.current?.kill()
      winDelayRef.current = gsap.delayedCall(remainingAnimationTime + 0.02, startWinAnimation)
      return () => {
        winDelayRef.current?.kill()
        winDelayRef.current = null
        winAnimationQueuedRef.current = false
      }
    }

    startWinAnimation()
  }, [game?.gameId, isWinSequence, setOutcomeAnimationRunning])

  useEffect(() => {
    if (game?.gameId) return

    crashDelayRef.current?.kill()
    crashDelayRef.current = null
    crashAnimationQueuedRef.current = false
    winDelayRef.current?.kill()
    winDelayRef.current = null
    winAnimationQueuedRef.current = false
    animationRef.current?.kill()
    crashAnimationRunningRef.current = false
    winAnimationRunningRef.current = false
    setOutcomeAnimationRunning(false)
    previousRoadRef.current = null
    previousVisiblePositionRef.current = 0
    requestAnimationFrame(() => {
      setRenderWindowStart(0)
    })
    finishedCrashGameRef.current = null
    finishedWinGameRef.current = null
    if (capybaraRef.current) {
      gsap.killTweensOf(capybaraRef.current)
      gsap.set(capybaraRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        transformOrigin: "50% 50%",
      })
    }
    if (boardRef.current) {
      gsap.killTweensOf(boardRef.current)
      gsap.set(boardRef.current, { x: 0 })
    }
    if (viewportRef.current) {
      gsap.killTweensOf(viewportRef.current)
      gsap.set(viewportRef.current, { x: 0, y: 0 })
    }
    if (brokenScreenRef.current) {
      gsap.killTweensOf(brokenScreenRef.current)
      gsap.set(brokenScreenRef.current, { opacity: 0, scale: 1 })
    }
    if (ufoRef.current) {
      gsap.killTweensOf(ufoRef.current)
      gsap.set(ufoRef.current, {
        x: 0,
        y: 0,
        opacity: 0,
        rotation: 0,
        scale: 1,
      })
    }
    if (beamRef.current) {
      gsap.killTweensOf(beamRef.current)
      gsap.set(beamRef.current, {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        opacity: 0,
        scaleY: 0.2,
      })
    }
    if (ducksRef.current) {
      gsap.killTweensOf(ducksRef.current)
      gsap.set(ducksRef.current, {
        x: -999,
        y: -999,
        opacity: 0,
        rotation: 0,
        scale: 1,
      })
    }
  }, [game?.gameId, setOutcomeAnimationRunning])

  return (
    <div className="relative w-full h-full bg-accent">
      <div className="absolute left-4 right-4 top-4 z-[5] flex flex-wrap gap-2">
        <div className="badge badge-neutral badge-lg">
          {t("games.capyroad.board.currentRoad")}: {currentRoad}
        </div>
        <div className="badge badge-primary badge-lg">
          {t("games.capyroad.board.payout")}: {payoutMultiplier.toFixed(2)}x /{" "}
          {payout.toFixed(2)}
        </div>
        <div className={`badge badge-lg ${isCrashed ? "badge-error" : "badge-secondary"}`}>
          {t("games.capyroad.board.crashChance")}: {crashProbability}%
        </div>
      </div>

      <div ref={viewportRef} className="relative w-full h-full overflow-hidden pt-20">
        {showStartSidewalk && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-20 z-0"
            style={{ width: `${sidewalkWidthPercent}%` }}>
            <SidewalkStart />
          </div>
        )}

        <div
          ref={boardRef}
          className="absolute bottom-0 top-20 z-0 grid h-full"
          style={{
            left: `${boardLeftPercent}%`,
            width: `${boardWidthPercent}%`,
            gridTemplateColumns: `repeat(${renderedRoads.length}, minmax(0, 1fr))`,
          }}>
          {renderedRoads.map(({ actualIndex, multiplier }) => (
            <Road
              key={actualIndex}
              start={actualIndex === 0}
              text={`${Number(multiplier).toFixed(2)}x`}
              isCurrent={actualIndex === currentRoad}
              isPassed={actualIndex < currentRoad}
              isCrashed={isCrashed && actualIndex === currentRoad}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-20 z-[5] overflow-hidden">
          <div ref={capybaraRef} className="absolute bottom-6 left-0 z-[5] will-change-transform">
            <Capybara crashed={isCrashed} />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-20 z-[6] overflow-hidden">
          <div ref={ducksRef} className="absolute left-0 top-0 z-[6] will-change-transform opacity-0">
            <img src={ducksImg} alt="Ducks" className="w-28 md:w-32" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-20 z-[7] overflow-hidden">
          <div
            ref={beamRef}
            className="absolute left-0 top-0 z-[7] opacity-0 will-change-transform"
            style={{
              clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(197,255,250,0.42) 36%, rgba(155,255,232,0.12) 100%)",
              filter: "blur(4px)",
            }}
          />
          <div ref={ufoRef} className="absolute left-0 top-0 z-[7] will-change-transform opacity-0">
            <img src={ufoImg} alt="UFO" className="w-48 md:w-56" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[8] overflow-hidden">
          <img
            ref={brokenScreenRef}
            src={brokenScreenImg}
            alt="Broken screen"
            className="h-full w-full object-cover opacity-0 will-change-transform"
          />
        </div>
      </div>
    </div>
  )
}

export default Capyroad
