import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const SidewalkStart = () => {
  const { t } = useLocale()

  return (
    <div className="relative h-full w-full overflow-hidden border-r border-black/20 bg-stone-400 shadow-inner">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(214,214,208,1)_0%,rgba(178,178,171,1)_42%,rgba(146,146,139,1)_100%)]" />
      <div className="absolute inset-0 opacity-35 bg-[linear-gradient(90deg,transparent_0%,transparent_23%,rgba(80,80,75,0.22)_24%,rgba(80,80,75,0.22)_26%,transparent_27%,transparent_49%,rgba(80,80,75,0.22)_50%,rgba(80,80,75,0.22)_52%,transparent_53%,transparent_74%,rgba(80,80,75,0.22)_75%,rgba(80,80,75,0.22)_77%,transparent_78%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(180deg,transparent_0%,transparent_18%,rgba(255,255,255,0.38)_19%,transparent_20%,transparent_39%,rgba(80,80,75,0.24)_40%,transparent_41%,transparent_62%,rgba(255,255,255,0.28)_63%,transparent_64%,transparent_82%,rgba(80,80,75,0.2)_83%,transparent_84%)]" />
      <div className="absolute inset-y-0 right-0 w-2 border-l border-white/35 bg-stone-500/95 shadow-[-3px_0_10px_rgba(0,0,0,0.18)] sm:w-3" />
      <div className="absolute top-[7.5rem] left-1/2 h-fit -translate-x-1/2 rounded-sm border border-white/45 bg-black/45 px-2 py-1 text-lg font-bold uppercase text-white shadow-md sm:text-xl md:text-2xl lg:text-3xl">
        {t("games.capyroad.board.start")}
      </div>

      <div className="relative flex h-full flex-col justify-between px-3 py-8">
        <div className="space-y-2 opacity-85">
          <div className="h-3 rounded-full bg-white/45 shadow-sm sm:h-4" />
          <div className="h-3 rounded-full bg-black/10 sm:h-4" />
          <div className="h-3 rounded-full bg-white/35 sm:h-4" />
        </div>

        <div className="space-y-2 opacity-80">
          <div className="h-2.5 rounded-full bg-white/28 sm:h-3" />
          <div className="h-2.5 rounded-full bg-black/12 sm:h-3" />
          <div className="h-2.5 rounded-full bg-white/28 sm:h-3" />
        </div>
      </div>
    </div>
  )
}

export default SidewalkStart
