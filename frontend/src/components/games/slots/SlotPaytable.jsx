import React from "react"
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
  "starwars": [
    { symbol: "seven",  img: seven3x3Img,  payout: 100  },
    { symbol: "bar",    img: bar3x3Img,    payout: 30   },
    { symbol: "bell",   img: bell3x3Img,   payout: 10   },
    { symbol: "plum",   img: plum3x3Img,   payout: 5    },
    { symbol: "orange", img: orange3x3Img, payout: 1.8  },
    { symbol: "lemon",  img: lemon3x3Img,  payout: 0.8  },
    { symbol: "cherry", img: cherry3x3Img, payout: 0.5  },
  ],
  "stardewvalley": [
    { symbol: "seven",  img: seven3x5Img,  payout: 100  },
    { symbol: "bar",    img: bar3x5Img,    payout: 30   },
    { symbol: "bell",   img: bell3x5Img,   payout: 10   },
    { symbol: "plum",   img: plum3x5Img,   payout: 5    },
    { symbol: "orange", img: orange3x5Img, payout: 1.8  },
    { symbol: "lemon",  img: lemon3x5Img,  payout: 0.8  },
    { symbol: "cherry", img: cherry3x5Img, payout: 0.5  },
  ],
  "beerman": [
    { symbol: "seven",  img: seven5x5Img,  payout: 100  },
    { symbol: "bar",    img: bar5x5Img,    payout: 30   },
    { symbol: "bell",   img: bell5x5Img,   payout: 10   },
    { symbol: "plum",   img: plum5x5Img,   payout: 5    },
    { symbol: "orange", img: orange5x5Img, payout: 1.8  },
    { symbol: "lemon",  img: lemon5x5Img,  payout: 0.8  },
    { symbol: "cherry", img: cherry5x5Img, payout: 0.5  },
  ],
}

const SlotPaytable = ({ theme = "starwars", horizontal = false }) => {
  const entries = PAYTABLE[theme]
  if (!entries) return null

  if (horizontal) {
    return (
      <div className="w-full flex flex-row items-center rounded-lg border border-amber-800/40 bg-neutral-900/80 overflow-hidden">
        {/* Label */}
        <div className="px-2.5 py-2 bg-linear-to-r from-amber-900/60 to-amber-800/40 border-r border-amber-800/40 shrink-0 self-stretch flex flex-col items-center justify-center gap-0.5">
          <p className="text-[8px] font-bold tracking-widest uppercase text-amber-400/80 leading-tight">Pay</p>
          <p className="text-[8px] text-amber-500/60 leading-none">×bet</p>
        </div>
        {/* Symbols */}
        <div className="flex-1 flex flex-row divide-x divide-amber-800/20 overflow-x-auto">
          {entries.map(({ symbol, img, payout }) => (
            <div key={symbol} className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1 px-0.5">
              <img
                src={img}
                alt={symbol}
                className="w-7 h-7 rounded object-cover border border-amber-800/30 shrink-0"
              />
              <span className="text-[8px] font-bold text-amber-300 leading-none whitespace-nowrap">
                ×{payout}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-24 md:w-28 lg:w-32 shrink-0 flex flex-col rounded-xl border border-amber-800/40 bg-neutral-900/80 overflow-hidden">
      {/* Header */}
      <div className="px-1 py-1 md:px-2 md:py-1.5 bg-linear-to-b from-amber-900/60 to-amber-800/40 border-b border-amber-800/40 shrink-0">
        <p className="text-center text-[8px] md:text-[9px] font-bold tracking-widest uppercase text-amber-400/80 leading-tight">
          Paytable
        </p>
        <p className="text-center text-[8px] md:text-[9px] text-amber-500/60 leading-none">
          ×bet
        </p>
      </div>

      {/* Symbol list */}
      <div className="flex-1 flex flex-col divide-y divide-amber-800/20 min-h-0">
        {entries.map(({ symbol, img, payout }) => (
          <div key={symbol} className="flex-1 flex items-center justify-center gap-1 md:gap-2 min-h-0 px-1">
            <img
              src={img}
              alt={symbol}
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded object-cover border border-amber-800/30 shrink-0"
            />
            <span className="text-[9px] md:text-[10px] lg:text-[11px] font-bold text-amber-300 leading-none">
              ×{payout}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SlotPaytable
