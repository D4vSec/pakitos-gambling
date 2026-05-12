import React, { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useSlots } from "@/providers/SlotsProvider"
import { useLocale } from "@/providers/LocaleProvider"
import SlotGrid from "./SlotGrid"
import SlotPaytable from "./SlotPaytable"
import BitcoinSVG from "@/components/svg/pictures/BitcoinSVG"
import { DIMS_BY_TYPE } from "./slotConstants"
import "./SlotMachine.css"

const SlotMachine = ({ type = "3x3" }) => {
  const { session, spins, isSpinning } = useSlots()
  const { t } = useLocale()

  const lastSpin = spins[spins.length - 1] ?? null
  const { rows: defaultRows, cols: defaultCols } = DIMS_BY_TYPE[type] ?? {
    rows: 3,
    cols: 3,
  }
  const rows = session?.rows ?? defaultRows
  const cols = session?.cols ?? defaultCols

  const [showResult, setShowResult] = useState(false)
  const flashRef = useRef(null)

  useEffect(() => {
    if (isSpinning) setShowResult(false)
  }, [isSpinning])

  // Called by SlotGrid when the last reel finishes landing
  const handleAllSettled = useCallback(() => setShowResult(true), [])

  // Gold flash overlay on win — fade in then fade out (bell curve, no abrupt start)
  useEffect(() => {
    if (!showResult || !lastSpin?.isWinner || !flashRef.current) return
    gsap.timeline()
      .fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.45, duration: 0.35, ease: "power2.in" })
      .to(flashRef.current, { opacity: 0, duration: 1.0, ease: "power2.out" })
  }, [showResult, lastSpin?.isWinner])

  const hasWon = showResult && !!lastSpin?.isWinner

  return (
    <div className="flex flex-row items-stretch gap-3 w-full h-full p-3">
      {/* Left: paytable — fixed width, full height */}
      <SlotPaytable machineType={type} />

      {/* Right: machine content */}
      <div className="flex flex-col items-center justify-center gap-2 flex-1 min-w-0 h-full">
        {/* Machine header */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_2px] shadow-amber-400/70 animate-pulse" />
            <h2 className="text-2xl font-black tracking-widest uppercase bg-linear-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow">
              {t("games.slots.title")}
            </h2>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_2px] shadow-amber-400/70 animate-pulse" />
          </div>
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-600/70">
            {t(`games.slots.${type}`)}
          </span>
        </div>

        {/* Reel window — fills remaining height, aspect ratio keeps it square/proportional */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
          <div
            className={`relative overflow-hidden ${
              type === "3x3" ? "max-w-xl" :
              type === "3x5" ? "max-w-4xl" :
              /* 5x5 */        "max-w-2xl"
            }`}
            style={{ aspectRatio: `${cols} / ${rows}`, maxHeight: "100%", width: "100%" }}
          >
            {/* Win flash overlay */}
            <div
              ref={flashRef}
              className="pointer-events-none absolute inset-0 z-20 rounded-xl opacity-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(251,191,36,0.6) 0%, transparent 70%)",
              }}
            />

            {/* Top decorative bar */}
            <div className="h-3 rounded-t-xl bg-linear-to-r from-amber-800 via-yellow-500 to-amber-800 shadow-[0_2px_8px] shadow-amber-500/30" />

            <SlotGrid
              grid={lastSpin?.grid ?? null}
              winningLines={lastSpin?.winningLines ?? []}
              rows={rows}
              cols={cols}
              machineType={type}
              paylines={session?.paylines}
              isSpinning={isSpinning}
              hasWon={hasWon}
              onAllSettled={handleAllSettled}
            />

            {/* Bottom decorative bar */}
            <div className="h-3 rounded-b-xl bg-linear-to-r from-amber-800 via-yellow-500 to-amber-800 shadow-[0_-2px_8px] shadow-amber-500/30" />
          </div>
        </div>

        {/* Result — fixed height so layout never shifts */}
        <div className="h-9 flex items-center justify-center shrink-0">
          {lastSpin && showResult && (
            <div
              className={`flex items-center gap-2 text-lg font-bold transition-opacity duration-300 ${
                lastSpin.isWinner
                  ? "text-warning drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                  : "text-error/80"
              }`}>
              {lastSpin.isWinner ? (
                <>
                  <span>{t("games.result.win")}</span>
                  <span>+{lastSpin.payout}</span>
                  <BitcoinSVG />
                </>
              ) : (
                <span>{t("games.result.lose")}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SlotMachine
