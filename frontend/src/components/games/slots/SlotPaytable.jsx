import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { SLOT_SYMBOLS_BY_THEME } from "./slotThemeAssets"

const PAYTABLE = {
  starwars: [
    { symbol: "seven", img: SLOT_SYMBOLS_BY_THEME.starwars.seven, payout: 100 },
    { symbol: "bar", img: SLOT_SYMBOLS_BY_THEME.starwars.bar, payout: 30 },
    { symbol: "bell", img: SLOT_SYMBOLS_BY_THEME.starwars.bell, payout: 10 },
    { symbol: "plum", img: SLOT_SYMBOLS_BY_THEME.starwars.plum, payout: 5 },
    { symbol: "orange", img: SLOT_SYMBOLS_BY_THEME.starwars.orange, payout: 1.8 },
    { symbol: "lemon", img: SLOT_SYMBOLS_BY_THEME.starwars.lemon, payout: 0.8 },
    { symbol: "cherry", img: SLOT_SYMBOLS_BY_THEME.starwars.cherry, payout: 0.5 },
  ],
  stardewvalley: [
    {
      symbol: "seven",
      img: SLOT_SYMBOLS_BY_THEME.stardewvalley.seven,
      payout: 100,
    },
    { symbol: "bar", img: SLOT_SYMBOLS_BY_THEME.stardewvalley.bar, payout: 30 },
    {
      symbol: "bell",
      img: SLOT_SYMBOLS_BY_THEME.stardewvalley.bell,
      payout: 10,
    },
    {
      symbol: "plum",
      img: SLOT_SYMBOLS_BY_THEME.stardewvalley.plum,
      payout: 5,
    },
    {
      symbol: "orange",
      img: SLOT_SYMBOLS_BY_THEME.stardewvalley.orange,
      payout: 1.8,
    },
    {
      symbol: "lemon",
      img: SLOT_SYMBOLS_BY_THEME.stardewvalley.lemon,
      payout: 0.8,
    },
    {
      symbol: "cherry",
      img: SLOT_SYMBOLS_BY_THEME.stardewvalley.cherry,
      payout: 0.5,
    },
  ],
  beerman: [
    { symbol: "seven", img: SLOT_SYMBOLS_BY_THEME.beerman.seven, payout: 100 },
    { symbol: "bar", img: SLOT_SYMBOLS_BY_THEME.beerman.bar, payout: 30 },
    { symbol: "bell", img: SLOT_SYMBOLS_BY_THEME.beerman.bell, payout: 10 },
    { symbol: "plum", img: SLOT_SYMBOLS_BY_THEME.beerman.plum, payout: 5 },
    { symbol: "orange", img: SLOT_SYMBOLS_BY_THEME.beerman.orange, payout: 1.8 },
    { symbol: "lemon", img: SLOT_SYMBOLS_BY_THEME.beerman.lemon, payout: 0.8 },
    { symbol: "cherry", img: SLOT_SYMBOLS_BY_THEME.beerman.cherry, payout: 0.5 },
  ],
}

const SlotPaytable = ({ theme = "starwars", horizontal = false }) => {
  const { t } = useLocale()
  const entries = PAYTABLE[theme]
  if (!entries) return null
  const displayEntries = horizontal ? [...entries].reverse() : entries

  if (horizontal) {
    return (
      <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-accent/40 bg-neutral-900/90 shadow-[0_0_16px] shadow-accent/15">
        <div className="flex min-w-0 flex-1 flex-wrap justify-center">
          {displayEntries.map(({ symbol, img, payout }) => (
            <div
              key={symbol}
              className="flex basis-1/4 flex-col items-center justify-center gap-0.5 border-accent/15 px-0.5 py-1.5 sm:basis-[14.285714%] sm:gap-1 sm:border-l sm:px-1.5 sm:py-2 sm:first:border-l-0">
              <img
                src={img}
                alt={symbol}
                className="h-11 w-11 shrink-0 rounded-md border border-accent/35 object-cover shadow-[0_0_10px] shadow-accent/10 sm:h-12 sm:w-12"
              />
              <span className="text-xs leading-none font-black whitespace-nowrap text-accent sm:text-sm">
                ×{payout}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-36 shrink-0 flex-col overflow-hidden rounded-xl border border-accent/40 bg-neutral-900/90 shadow-[0_0_18px] shadow-accent/15 lg:w-40 xl:w-44">
      <div className="shrink-0 border-b border-accent/30 bg-linear-to-br from-accent/80 via-warning to-accent/80 px-2 py-2 lg:px-3 lg:py-2.5">
        <p className="text-center text-xs leading-tight font-black tracking-widest text-accent-content uppercase lg:text-sm">
          {t("games.slots.controls.paytable")}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col divide-y divide-accent/15">
        {entries.map(({ symbol, img, payout }) => (
          <div
            key={symbol}
            className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 lg:gap-3 lg:px-3">
            <img
              src={img}
              alt={symbol}
              className="h-12 w-12 shrink-0 rounded-lg border border-accent/35 object-cover shadow-[0_0_10px] shadow-accent/10 lg:h-14 lg:w-14 xl:h-16 xl:w-16"
            />
            <span className="text-sm leading-none font-black text-accent lg:text-base xl:text-lg">
              ×{payout}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SlotPaytable
