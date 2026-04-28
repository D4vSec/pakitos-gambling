import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"

const POOL = ["cherry", "lemon", "orange", "plum", "bell", "bar", "seven"]
const DISPLAY = {
  cherry: "🍒",
  lemon: "🍋",
  orange: "🍊",
  plum: "🍇",
  bell: "🔔",
  bar: "BAR",
  seven: "7",
}
const rand = () => POOL[Math.floor(Math.random() * POOL.length)]

// SlotReel manages all animation via GSAP directly on the DOM — no setInterval,
// no React re-renders during spin — so there are no "cut" artifacts between frames.
const SlotReel = ({
  symbols = [],
  rows = 3,
  colIndex = 0,
  isSpinning,
  stopDelay = 0,
  winningCells,
}) => {
  const spanRefs = useRef([])
  const cellRefs = useRef([])
  const spinTweensRef = useRef([])
  const winTweensRef = useRef([])
  const stopTimerRef = useRef(null)
  const spinRafRef = useRef(null)
  const landRafRef = useRef(null)
  const phaseRef = useRef("idle")
  const [phase, setPhase] = useState("idle")
  // idleSymbols drives React rendering; only updated when NOT animating
  const [idleSymbols, setIdleSymbols] = useState(() =>
    symbols.length === rows ? [...symbols] : Array(rows).fill(null),
  )

  const clearSpinTweens = () => {
    if (spinRafRef.current !== null) {
      cancelAnimationFrame(spinRafRef.current)
      spinRafRef.current = null
    }
    if (landRafRef.current !== null) {
      cancelAnimationFrame(landRafRef.current)
      landRafRef.current = null
    }
    spinTweensRef.current.forEach((t) => t?.kill())
    spinTweensRef.current = []
    clearTimeout(stopTimerRef.current)
    stopTimerRef.current = null
  }

  const clearWinTweens = () => {
    winTweensRef.current.forEach((t) => t?.kill())
    winTweensRef.current = []
    cellRefs.current.forEach((el) => el && gsap.set(el, { scale: 1 }))
  }

  useEffect(() => {
    clearSpinTweens()
    clearWinTweens()

    if (isSpinning) {
      phaseRef.current = "spinning"
      setPhase("spinning")

      spinRafRef.current = requestAnimationFrame(() => {
        spinRafRef.current = null
        if (phaseRef.current !== "spinning") return

        spinTweensRef.current = spanRefs.current.map((span, r) => {
          if (!span) return null
          // Set initial random symbol while element is still hidden (y=-100%)
          gsap.set(span, { y: "-100%" })
          const sym = rand()
          span.textContent = DISPLAY[sym] ?? sym

          return gsap.to(span, {
            y: "0%",
            duration: 0.1,
            ease: "none",
            repeat: -1,
            // Tiny cascade: each row starts slightly after the one above
            delay: r * 0.018,
            onRepeat() {
              // Symbol changes while hidden above viewport — no visible jump
              const next = rand()
              span.textContent = DISPLAY[next] ?? next
              gsap.set(span, { y: "-100%" })
            },
          })
        })
      })
    } else if (phaseRef.current === "spinning") {
      phaseRef.current = "decelerating"
      setPhase("decelerating")

      stopTimerRef.current = setTimeout(() => {
        stopTimerRef.current = null
        clearSpinTweens()

        const finalSyms =
          symbols.length === rows ? [...symbols] : Array(rows).fill(null)

        landRafRef.current = requestAnimationFrame(() => {
          landRafRef.current = null
          if (phaseRef.current !== "decelerating") return

          spinTweensRef.current = spanRefs.current.map((span, r) => {
            if (!span) return null
            // Snap above viewport, set final content, then land smoothly
            gsap.set(span, { y: "-100%", opacity: 0.6 })
            const sym = finalSyms[r]
            span.textContent = sym ? (DISPLAY[sym] ?? sym) : "?"

            return gsap.to(span, {
              y: "0%",
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
              // Top-to-bottom cascade stop, matching roulette deceleration style
              delay: r * 0.05,
              onComplete:
                r === rows - 1
                  ? () => {
                      setIdleSymbols([...finalSyms])
                      phaseRef.current = "stopped"
                      setPhase("stopped")
                    }
                  : undefined,
            })
          })
        })
      }, stopDelay)
    }

    return () => {
      clearSpinTweens()
      clearWinTweens()
    }
  }, [isSpinning]) // eslint-disable-line react-hooks/exhaustive-deps

  // Winning cell pulse — fires after landing completes
  useEffect(() => {
    clearWinTweens()
    if (phase !== "stopped" || !winningCells?.size) return

    winTweensRef.current = cellRefs.current.map((el, r) => {
      if (!el || !winningCells.has(`${r},${colIndex}`)) return null
      return gsap.fromTo(
        el,
        { scale: 1 },
        { scale: 1.05, duration: 0.4, repeat: -1, yoyo: true, ease: "power2.inOut" },
      )
    })
  }, [phase, winningCells, colIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync static display when idle (initial load or session recovery)
  useEffect(() => {
    if (phaseRef.current !== "idle") return
    const syms =
      symbols.length === rows ? [...symbols] : Array(rows).fill(null)
    setIdleSymbols(syms)
    spanRefs.current.forEach((span, r) => {
      if (!span) return
      const sym = syms[r]
      // Set content via GSAP (not JSX) — span never has React-managed children
      span.textContent = sym ? (DISPLAY[sym] ?? sym) : ""
      gsap.set(span, { y: 0, opacity: 1 })
    })
  }, [symbols]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-1.5 flex-1 px-1.5">
      {Array.from({ length: rows }, (_, r) => {
        const sym = idleSymbols[r]
        const isWin =
          phase === "stopped" && !!winningCells?.has(`${r},${colIndex}`)
        return (
          <div
            key={r}
            ref={(el) => { cellRefs.current[r] = el }}
            className={`
              relative w-full aspect-square overflow-hidden rounded-lg border-2 select-none
              transition-colors duration-300
              ${isWin
                ? "border-warning bg-warning/15 shadow-[0_0_12px_2px] shadow-warning/50"
                : "border-neutral-700 bg-neutral-800"
              }
            `}
          >
            {/* Placeholder shown only when no symbol is set yet */}
            {!sym && (
              <span className="absolute inset-0 flex items-center justify-center text-xl opacity-20 text-neutral-400 pointer-events-none">
                ?
              </span>
            )}
            {/*
              GSAP-controlled span: never has React children so React's reconciler
              won't fight GSAP's textContent writes (avoids removeChild crash).
            */}
            <span
              ref={(el) => { spanRefs.current[r] = el }}
              className="absolute inset-0 flex items-center justify-center text-4xl font-bold"
            />
          </div>
        )
      })}
    </div>
  )
}

export default SlotReel
