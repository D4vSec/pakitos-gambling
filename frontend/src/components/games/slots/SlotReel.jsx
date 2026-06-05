import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { WIN_REVEAL_DELAY_MS } from "./slotConstants"
import {
  SLOT_PLACEHOLDERS_BY_THEME,
  SLOT_SYMBOLS_BY_THEME,
} from "./slotThemeAssets"

const SYMBOLS = ["cherry", "lemon", "orange", "plum", "bell", "bar", "seven"]
const rand = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]

// Full cell traversal duration (y: -100% → 100%). Two images are staggered by
// half this value so one is always crossing y=0% (visible center) at any moment.
const SPIN_DURATION = 0.22
const STAGGER = SPIN_DURATION / 2

const SlotReel = ({
  symbols = [],
  rows = 3,
  colIndex = 0,
  reelSize = 171,
  theme = "starwars",
  isSpinning,
  stopDelay = 0,
  winningCells,
  onSettled,
}) => {
  const DISPLAY = SLOT_SYMBOLS_BY_THEME[theme] ?? SLOT_SYMBOLS_BY_THEME.starwars
  const placeholderImg =
    SLOT_PLACEHOLDERS_BY_THEME[theme] ?? SLOT_PLACEHOLDERS_BY_THEME.starwars
  const imgARefs = useRef([]) // primary img per row — used for spin, landing, idle
  const imgBRefs = useRef([]) // secondary img per row — only active during spin
  const cellRefs = useRef([])
  const spinTweensRef = useRef([])
  const winTweensRef = useRef([])
  const stopTimerRef = useRef(null)
  const settleTimerRef = useRef(null)
  const spinRafRef = useRef(null)
  const landRafRef = useRef(null)
  const phaseRef = useRef("idle")
  const [phase, setPhase] = useState("idle")
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
    clearTimeout(settleTimerRef.current)
    settleTimerRef.current = null
  }

  const clearWinTweens = () => {
    winTweensRef.current.forEach((t) => t?.kill())
    winTweensRef.current = []
    cellRefs.current.forEach((el) => el && gsap.set(el, { scale: 1 }))
  }

  // Park imgB off-screen below so it never intrudes on landing/idle display
  const hideImgB = () => {
    imgBRefs.current.forEach((el) => {
      if (el) gsap.set(el, { y: "100%", opacity: 0 })
    })
  }

  // Cleanup only on unmount — NOT on every isSpinning change.
  // If cleanup ran on every change, React would kill all spin tweens the moment
  // isSpinning flips false, before each reel's individual stopDelay fires.
  useEffect(
    () => () => {
      clearSpinTweens()
      clearWinTweens()
    },
    [],
  )

  useEffect(() => {
    clearWinTweens()

    if (isSpinning) {
      // Fresh spin: kill any leftover animations from previous round
      clearSpinTweens()
      phaseRef.current = "spinning"

      spinRafRef.current = requestAnimationFrame(() => {
        spinRafRef.current = null
        if (phaseRef.current !== "spinning") return
        setPhase("spinning")

        const makeTween = (el, delay) => {
          if (!el) return null
          el.src = DISPLAY[rand()]
          el.alt = ""
          gsap.set(el, { y: "-100%", opacity: 1 })

          // fromTo: GSAP auto-resets to y="-100%" on each repeat, so onRepeat
          // fires while the element is off-screen top — src change is invisible.
          // The jump from y="100%" → y="-100%" also happens off-screen (overflow:hidden).
          return gsap.fromTo(
            el,
            { y: "-100%" },
            {
              y: "100%",
              duration: SPIN_DURATION,
              ease: "none",
              repeat: -1,
              delay,
              onRepeat() {
                el.src = DISPLAY[rand()]
              },
            },
          )
        }

        spinTweensRef.current = imgARefs.current.flatMap((imgA, r) => {
          const imgB = imgBRefs.current[r]
          // Cascade: each row starts slightly after the one above
          const rowOffset = r * 0.018
          return [
            makeTween(imgA, rowOffset),
            makeTween(imgB, STAGGER + rowOffset),
          ]
        })
      })
    } else if (phaseRef.current === "spinning") {
      // Do NOT call clearSpinTweens() here — each reel must keep spinning
      // until its own stopDelay fires. Clearing here would freeze all reels at once.
      phaseRef.current = "decelerating"
      requestAnimationFrame(() => {
        if (phaseRef.current === "decelerating") setPhase("decelerating")
      })

      stopTimerRef.current = setTimeout(() => {
        stopTimerRef.current = null
        clearSpinTweens() // stop only THIS reel's animation
        hideImgB()

        const finalSyms =
          symbols.length === rows ? [...symbols] : Array(rows).fill(null)

        landRafRef.current = requestAnimationFrame(() => {
          landRafRef.current = null
          if (phaseRef.current !== "decelerating") return

          spinTweensRef.current = imgARefs.current.map((imgA, r) => {
            if (!imgA) return null
            gsap.set(imgA, { y: "-100%", opacity: 0.6 })
            const sym = finalSyms[r]
            imgA.src = sym ? (DISPLAY[sym] ?? "") : ""
            imgA.alt = sym ?? ""

            return gsap.to(imgA, {
              y: "0%",
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
              delay: r * 0.05,
              onComplete:
                r === rows - 1
                  ? () => {
                    setIdleSymbols([...finalSyms])
                      // Brief pause so the symbols are visible before winning effects appear
                      settleTimerRef.current = setTimeout(() => {
                        settleTimerRef.current = null
                        if (phaseRef.current !== "decelerating") return
                        phaseRef.current = "stopped"
                        setPhase("stopped")
                        onSettled?.()
                      }, WIN_REVEAL_DELAY_MS)
                    }
                  : undefined,
            })
          })
        })
      }, stopDelay)
    }
  }, [isSpinning]) // eslint-disable-line react-hooks/exhaustive-deps

  // Winning cell pulse
  useEffect(() => {
    clearWinTweens()
    if (phase !== "stopped" || !winningCells?.size) return

    winTweensRef.current = cellRefs.current.map((el, r) => {
      if (!el || !winningCells.has(`${r},${colIndex}`)) return null
      return gsap.fromTo(
        el,
        { scale: 1 },
        {
          scale: 1.05,
          duration: 0.4,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 0.35,
        },
      )
    })
  }, [phase, winningCells, colIndex])

  // Sync static display on idle (initial load / session recovery / session end)
  useEffect(() => {
    const allNull = symbols.every((s) => s == null)
    // Reset to idle when session ends (all symbols cleared while stopped)
    if (phaseRef.current === "stopped" && allNull) {
      phaseRef.current = "idle"
      requestAnimationFrame(() => setPhase("idle"))
    }
    if (phaseRef.current !== "idle") return
    const syms = symbols.length === rows ? [...symbols] : Array(rows).fill(null)
    requestAnimationFrame(() => {
      if (phaseRef.current === "idle") setIdleSymbols(syms)
    })
    hideImgB()
    imgARefs.current.forEach((imgA, r) => {
      if (!imgA) return
      const sym = syms[r]
      imgA.src = sym ? (DISPLAY[sym] ?? "") : ""
      imgA.alt = sym ?? ""
      gsap.set(imgA, { y: 0, opacity: sym ? 1 : 0 })
    })
  }, [symbols, rows, DISPLAY])

  return (
    <div
      className="grid shrink-0 gap-0 px-0"
      style={{
        width: `${reelSize}px`,
        gridTemplateRows: `repeat(${rows}, ${reelSize}px)`,
      }}>
      {Array.from({ length: rows }, (_, r) => {
        const sym = idleSymbols[r]
        const isWin =
          phase === "stopped" && !!winningCells?.has(`${r},${colIndex}`)
        return (
          <div
            key={r}
            ref={(el) => {
              cellRefs.current[r] = el
            }}
            className={`
              relative aspect-square h-full w-full overflow-hidden rounded-lg border-2 select-none
              transition-all duration-500
              ${
                isWin
                  ? "border-neutral-700 bg-neutral-800 shadow-[0_0_12px_2px] shadow-success/40"
                  : "border-neutral-700 bg-neutral-800"
              }
            `}
          >
            {!sym && phase === "idle" && placeholderImg && (
              <img
                src={placeholderImg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            )}
            {!sym && phase === "idle" && !placeholderImg && (
              <span className="absolute inset-0 flex items-center justify-center text-xl opacity-20 text-neutral-400 pointer-events-none">
                ?
              </span>
            )}
            {/* imgA — primary, used during spin A, landing, and idle */}
            <img
              ref={(el) => {
                imgARefs.current[r] = el
              }}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
            {/* imgB — secondary, only active during spin to fill the gap between imgA cycles */}
            <img
              ref={(el) => {
                imgBRefs.current[r] = el
              }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "translateY(100%)", opacity: 0 }}
              alt=""
            />
            {isWin && (
              <div className="pointer-events-none absolute inset-0 z-10 bg-success/20" />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SlotReel
