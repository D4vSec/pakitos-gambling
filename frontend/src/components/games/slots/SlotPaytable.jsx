import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import cherry3x3Img from "@/assets/games/cherry3x3.jpg"
import lemon3x3Img from "@/assets/games/lemon3x3.jpg"
import orange3x3Img from "@/assets/games/orange3x3.jpg"
import plum3x3Img from "@/assets/games/plum3x3.jpg"
import bell3x3Img from "@/assets/games/bell3x3.jpg"
import bar3x3Img from "@/assets/games/bar3x3.jpg"
import seven3x3Img from "@/assets/games/seven3x3.jpg"
import cherry3x5Img from "@/assets/games/cherry3x5.png"
import lemon3x5Img from "@/assets/games/lemon3x5.png"
import orange3x5Img from "@/assets/games/orange3x5.png"
import plum3x5Img from "@/assets/games/plum3x5.png"
import bell3x5Img from "@/assets/games/bell3x5.png"
import bar3x5Img from "@/assets/games/bar3x5.png"
import seven3x5Img from "@/assets/games/seven3x5.png"
import cherry5x5Img from "@/assets/games/cherry5x5.jpg"
import lemon5x5Img from "@/assets/games/lemon5x5.jpg"
import orange5x5Img from "@/assets/games/orange5x5.png"
import plum5x5Img from "@/assets/games/plum5x5.png"
import bell5x5Img from "@/assets/games/bell5x5.png"
import bar5x5Img from "@/assets/games/bar5x5.png"
import seven5x5Img from "@/assets/games/seven5x5.png"

const PAYTABLE = {
  starwars: [
    { symbol: "seven", img: seven3x3Img, payout: 100 },
    { symbol: "bar", img: bar3x3Img, payout: 30 },
    { symbol: "bell", img: bell3x3Img, payout: 10 },
    { symbol: "plum", img: plum3x3Img, payout: 5 },
    { symbol: "orange", img: orange3x3Img, payout: 1.8 },
    { symbol: "lemon", img: lemon3x3Img, payout: 0.8 },
    { symbol: "cherry", img: cherry3x3Img, payout: 0.5 },
  ],
  stardewvalley: [
    { symbol: "seven", img: seven3x5Img, payout: 100 },
    { symbol: "bar", img: bar3x5Img, payout: 30 },
    { symbol: "bell", img: bell3x5Img, payout: 10 },
    { symbol: "plum", img: plum3x5Img, payout: 5 },
    { symbol: "orange", img: orange3x5Img, payout: 1.8 },
    { symbol: "lemon", img: lemon3x5Img, payout: 0.8 },
    { symbol: "cherry", img: cherry3x5Img, payout: 0.5 },
  ],
  beerman: [
    { symbol: "seven", img: seven5x5Img, payout: 100 },
    { symbol: "bar", img: bar5x5Img, payout: 30 },
    { symbol: "bell", img: bell5x5Img, payout: 10 },
    { symbol: "plum", img: plum5x5Img, payout: 5 },
    { symbol: "orange", img: orange5x5Img, payout: 1.8 },
    { symbol: "lemon", img: lemon5x5Img, payout: 0.8 },
    { symbol: "cherry", img: cherry5x5Img, payout: 0.5 },
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
