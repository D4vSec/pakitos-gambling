import React from "react"
import MultiplayerCircle from "./MultiplayerCircle"

const Road = ({ start, text, isCurrent, isPassed, isCrashed, children }) => {
  const stateOverlayClass = isCrashed
    ? "bg-error/20"
    : isCurrent
      ? "bg-success/12"
      : isPassed
        ? "bg-primary/10"
        : ""

  return (
    <div className="relative h-full w-full overflow-hidden border-r border-white/15 transition-all duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(84,84,84,0.98)_0%,rgba(42,42,42,1)_24%,rgba(50,50,50,1)_50%,rgba(38,38,38,1)_100%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,transparent_0%,transparent_42%,rgba(255,255,255,0.1)_50%,transparent_58%,transparent_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[3px] bg-white/30" />
      <div className="absolute inset-y-0 right-0 w-[3px] bg-white/18" />

      <div className="absolute inset-y-6 left-1/2 flex -translate-x-1/2 flex-col justify-between">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-8 w-1 rounded-full bg-white/55 shadow-[0_0_4px_rgba(255,255,255,0.12)]" />
        ))}
      </div>

      <div className="absolute inset-x-6 bottom-[6rem] flex items-end justify-between">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className={`h-20 w-2.5 rounded-sm shadow-[0_0_4px_rgba(255,255,255,0.18)] ${
              start ? "bg-white/92" : "bg-white/78"
            }`}
          />
        ))}
      </div>

      {stateOverlayClass && <div className={`absolute inset-0 ${stateOverlayClass}`} />}

      <div className="relative grid h-full grid-cols-1 grid-rows-1 pb-4 pt-4">
        <div className="col-start-1 row-start-1 flex items-center justify-center">
          <MultiplayerCircle text={text} />
        </div>

        <div className="col-start-1 row-start-1 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Road
