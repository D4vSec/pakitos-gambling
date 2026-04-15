import React, { useEffect, useState } from "react"
import InfoSVG from "../svg/InfoSVG"
import CheckSVG from "../svg/CheckSVG"
import AlertTriangleSVG from "../svg/AlertTriangleSVG"
import CircleXSVG from "../svg/CircleXSVG"

const GameNotification = ({ notification }) => {
  const [show, setShow] = useState(false)

  const svg = {
    info: <InfoSVG />,
    success: <CheckSVG />,
    warning: <AlertTriangleSVG />,
    error: <CircleXSVG />,
  }

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 20)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`
        relative overflow-hidden

        flex items-center gap-4
        px-7 py-5

        min-w-[360px]
        max-w-lg

        rounded-2xl

        text-white

        border border-yellow-300/30

        bg-gradient-to-b from-[#1a0f2e] via-[#2a1455] to-[#0b0618]

        shadow-[0_0_40px_rgba(255,215,0,0.25)]
        ring-1 ring-yellow-300/20

        transition-all duration-500 ease-out

        ${
          notification.leaving
            ? "opacity-0 scale-90 translate-y-6 blur-md"
            : show
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2"
        }

        before:absolute before:inset-0
        before:bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.25),transparent_60%)]
        before:opacity-70

        after:absolute after:inset-0
        after:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),transparent)]
        after:animate-[shimmer_2.5s_infinite]
      `}>
      {/* 💡 glow exterior tipo slot machine */}
      <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40 bg-yellow-400/10" />

      {/* 🎰 borde energético */}
      <div className="absolute inset-0 rounded-2xl border border-yellow-400/30 animate-pulse" />

      {/* icono slot */}
      <div className="relative w-11 h-11 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-md animate-pulse" />
        <div className="relative drop-shadow-[0_0_12px_rgba(255,215,0,0.7)]">
          {svg[notification.type]}
        </div>
      </div>

      {/* texto estilo jackpot */}
      <div className="relative flex flex-col">
        <span className="text-yellow-200 font-bold text-lg tracking-wider drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
          {notification.message}
        </span>

        <span className="text-xs text-yellow-300/70 tracking-[0.2em] uppercase">
          LUNA SLOT EVENT
        </span>
      </div>

      {/* ✨ sparkle layer */}
      <div className="absolute inset-0 opacity-20 animate-pulse bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.2),transparent_70%)]" />
    </div>
  )
}

export default GameNotification
