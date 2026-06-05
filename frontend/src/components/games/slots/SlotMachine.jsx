import React, { useCallback, useEffect, useState } from "react"
import { useSlots } from "@/providers/SlotsProvider"
import { useLocale } from "@/providers/LocaleProvider"
import SlotGrid from "./SlotGrid"
import SlotPaytable from "./SlotPaytable"
import { DIMS_BY_TYPE } from "./slotConstants"

const SlotMachine = ({ theme = "starwars" }) => {
  const { type, session, spins, isSpinning } = useSlots()
  const { t } = useLocale()

  const lastSpin = spins[spins.length - 1] ?? null
  const { rows: defaultRows, cols: defaultCols } = DIMS_BY_TYPE[type] ?? {
    rows: 3,
    cols: 3,
  }
  const rows = session?.rows ?? defaultRows
  const cols = session?.cols ?? defaultCols

  const [gridFrameWidth, setGridFrameWidth] = useState(null)
  const handleGridSizeChange = useCallback(({ width }) => {
    setGridFrameWidth((prevWidth) => (prevWidth === width ? prevWidth : width))
  }, [])

  return (
    <div className="flex h-full w-full flex-row items-stretch gap-2 p-1.5 md:gap-3 md:p-3">
      <div className="hidden lg:flex">
        <SlotPaytable theme={theme} />
      </div>

      <div className="flex h-full min-w-0 flex-1 items-center justify-center overflow-hidden">
        <div className="flex h-full max-h-full w-full min-w-0 items-center justify-center overflow-hidden">
          <div className="flex max-h-full max-w-full min-h-0 min-w-0 flex-col items-center justify-center gap-3 overflow-hidden md:gap-4">
            <div
              className="flex max-w-full shrink-0 flex-col items-center gap-0.5"
              style={{
                width: gridFrameWidth ? `${gridFrameWidth}px` : undefined,
              }}>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_6px_2px] shadow-amber-400/70 md:h-2 md:w-2" />
                <h2 className="bg-linear-to-r from-accent via-warning to-accent bg-clip-text text-base font-black tracking-widest text-transparent uppercase drop-shadow md:text-2xl">
                  {t("games.slots.title")}
                </h2>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_6px_2px] shadow-amber-400/70 md:h-2 md:w-2" />
              </div>
              <span className="text-sm md:text-md font-semibold tracking-[0.2em] md:tracking-[0.25em] uppercase text-secondary">
                {t(`games.slots.modes.${type}`)}
              </span>
            </div>

            <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
              <SlotGrid
                key={`${theme}-${type}-${rows}x${cols}`}
                className="max-h-full max-w-full"
                grid={lastSpin?.grid ?? null}
                winningLines={lastSpin?.winningLines ?? []}
                rows={rows}
                cols={cols}
                machineType={type}
                theme={theme}
                paylines={session?.paylines}
                isSpinning={isSpinning}
                onSizeChange={handleGridSizeChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlotMachine
