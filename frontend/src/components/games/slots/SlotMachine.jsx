import React, { useEffect, useRef, useState } from "react"
import { useSlots } from "@/providers/SlotsProvider"
import { useLocale } from "@/providers/LocaleProvider"
import SlotGrid from "./SlotGrid"
import BitcoinSVG from "@/components/svg/BitcoinSVG"
import "./SlotMachine.css"

import { getAnimTotalMs, DIMS_BY_TYPE } from "./slotConstants"

const SlotMachine = ({ type = "3x3" }) => {
  const { session, spins, isSpinning } = useSlots()
  const { t } = useLocale()

  const lastSpin = spins[spins.length - 1] ?? null
  const { rows: defaultRows, cols: defaultCols } = DIMS_BY_TYPE[type] ?? { rows: 3, cols: 3 }
  const rows = session?.rows ?? defaultRows
  const cols = session?.cols ?? defaultCols

  const [showResult, setShowResult] = useState(false)
  const timerRef = useRef(null)
  const wasSpinningRef = useRef(false)

  useEffect(() => {
    if (isSpinning) {
      wasSpinningRef.current = true
      clearTimeout(timerRef.current)
      setShowResult(false)
    } else if (wasSpinningRef.current) {
      timerRef.current = setTimeout(() => setShowResult(true), getAnimTotalMs(cols))
    }
    return () => clearTimeout(timerRef.current)
  }, [isSpinning])

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-full h-full p-4">

      {/* Machine cabinet header */}
      <div className="flex flex-col items-center gap-0.5">
        <h2 className="text-2xl font-black tracking-widest text-amber-400 drop-shadow-sm">
          🎰 {t("games.slots.title").toUpperCase()}
        </h2>
        <span className="text-xs font-semibold tracking-widest uppercase opacity-50">
          {t(`games.slots.${type}`)}
        </span>
      </div>

      {/* Reel window — wider for 5-column machines */}
      <div className={`w-full ${cols === 5 ? "max-w-2xl" : "max-w-xs"}`}>
        {/* Top decorative bar */}
        <div className="h-3 rounded-t-xl bg-linear-to-r from-amber-700 via-yellow-500 to-amber-700" />

        <SlotGrid
          grid={lastSpin?.grid ?? null}
          winningLines={lastSpin?.winningLines ?? []}
          rows={rows}
          cols={cols}
          machineType={type}
          paylines={session?.paylines}
          isSpinning={isSpinning}
        />

        {/* Bottom decorative bar */}
        <div className="h-3 rounded-b-xl bg-linear-to-r from-amber-700 via-yellow-500 to-amber-700" />
      </div>

      {/* Result display — fixed height to avoid layout shift */}
      <div className="h-8 flex items-center justify-center">
        {lastSpin && showResult && (
          <div
            className={`flex items-center gap-2 text-lg font-bold transition-opacity duration-300 ${
              lastSpin.isWinner ? "text-success" : "text-error"
            }`}
          >
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
  )
}

export default SlotMachine
