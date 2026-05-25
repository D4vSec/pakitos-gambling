import React from "react"

const SidewalkStart = () => {
  return (
    <div className="relative h-full w-full overflow-hidden border-r border-black/15 bg-stone-400">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(191,191,191,1)_0%,rgba(160,160,160,1)_100%)]" />
      <div className="absolute inset-0 opacity-28 bg-[linear-gradient(90deg,transparent_0%,transparent_24%,rgba(105,105,105,0.22)_25%,rgba(105,105,105,0.22)_26%,transparent_27%,transparent_49%,rgba(105,105,105,0.22)_50%,rgba(105,105,105,0.22)_51%,transparent_52%,transparent_74%,rgba(105,105,105,0.22)_75%,rgba(105,105,105,0.22)_76%,transparent_77%)]" />
      <div className="absolute inset-y-0 right-0 w-3 border-l border-white/25 bg-stone-500/95" />

      <div className="relative flex h-full flex-col justify-between px-3 py-8">
        <div className="space-y-2">
          <div className="h-4 rounded-full bg-white/35" />
          <div className="h-4 rounded-full bg-white/22" />
          <div className="h-4 rounded-full bg-white/35" />
        </div>

        <div className="space-y-2">
          <div className="h-3 rounded-full bg-white/26" />
          <div className="h-3 rounded-full bg-white/18" />
        </div>
      </div>
    </div>
  )
}

export default SidewalkStart
