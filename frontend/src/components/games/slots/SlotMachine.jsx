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

  useEffect(() => {
    setGridFrameWidth(null)
  }, [theme, type, rows, cols])

  return (
    <div className="flex h-full w-full flex-row items-stretch gap-2 p-1.5 md:gap-3 md:p-3">
      <div className="hidden lg:flex">
        <SlotPaytable theme={theme} />
      </div>

      <div className="flex h-full min-w-0 flex-1 items-stretch justify-center">
        <div className="flex h-full max-h-full w-full min-w-0 flex-col items-center gap-3 md:gap-4">
          <div
            className="flex max-w-full shrink-0 flex-col items-center gap-0.5"
            style={{
              width: gridFrameWidth ? `${gridFrameWidth}px` : undefined,
            }}>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400 shadow-[0_0_6px_2px] shadow-amber-400/70 animate-pulse" />
              <h2 className="text-base md:text-2xl font-black tracking-widest uppercase bg-linear-to-r from-accent via-warning to-accent bg-clip-text text-transparent drop-shadow">
                {t("games.slots.title")}
              </h2>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400 shadow-[0_0_6px_2px] shadow-amber-400/70 animate-pulse" />
            </div>
            <span className="text-sm md:text-md font-semibold tracking-[0.2em] md:tracking-[0.25em] uppercase text-secondary">
              {t(`games.slots.modes.${type}`)}
            </span>
          </div>

          <div className="flex min-h-0 flex-1 w-full items-stretch justify-center">
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
  )
}

export default SlotMachine
