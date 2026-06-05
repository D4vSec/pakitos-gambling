import React from "react"
import MultiplayerCircle from "./MultiplayerCircle"

const Road = ({
  start,
  text,
  isCurrent,
  isPassed,
  isCrashed,
  hasBarrier = false,
  stripeCount = 6,
  children,
}) => {
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
      <div className="absolute inset-y-0 left-0 w-0.75 bg-white/30" />
      <div className="absolute inset-y-0 right-0 w-0.75 bg-white/18" />

      <div className="absolute inset-y-4 left-1/2 flex -translate-x-1/2 flex-col justify-between sm:inset-y-5 lg:inset-y-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-5 w-0.5 rounded-full bg-white/55 shadow-[0_0_4px_rgba(255,255,255,0.12)] sm:h-7 sm:w-1 lg:h-8"
          />
        ))}
      </div>

      <div className="absolute inset-x-3 bottom-6 flex items-end justify-between sm:inset-x-4 sm:bottom-8 lg:inset-x-6 lg:bottom-10">
        {Array.from({ length: stripeCount }).map((_, index) => (
          <div
            key={index}
            className={`h-12 w-1.5 rounded-sm shadow-[0_0_4px_rgba(255,255,255,0.18)] sm:h-16 sm:w-2 lg:h-20 lg:w-2.5 ${
              start ? "bg-white/92" : "bg-white/78"
            }`}
          />
        ))}
      </div>

      {hasBarrier && (
        <div className="absolute inset-x-3 top-30 z-4 flex items-center sm:inset-x-4 lg:inset-x-6">
          <div className="h-5 w-2 rounded-sm bg-warning shadow-[0_2px_6px_rgba(0,0,0,0.3)] sm:h-6 sm:w-2.5" />
          <div className="h-2 flex-1 border-y border-black/25 bg-[repeating-linear-gradient(135deg,rgba(250,204,21,0.96)_0px,rgba(250,204,21,0.96)_12px,rgba(24,24,27,0.9)_12px,rgba(24,24,27,0.9)_22px)] shadow-[0_2px_8px_rgba(0,0,0,0.28)] sm:h-2.5" />
          <div className="h-5 w-2 rounded-sm bg-warning shadow-[0_2px_6px_rgba(0,0,0,0.3)] sm:h-6 sm:w-2.5" />
        </div>
      )}

      {stateOverlayClass && (
        <div className={`absolute inset-0 ${stateOverlayClass}`} />
      )}

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
