import React, { useEffect, useState } from "react"
import { IconCoinBitcoin } from "@tabler/icons-react"
import useCurrentBreakpoint from "@/hooks/useCurrentBreakpoint"

const GameNotification = ({ notification }) => {
  const [phase, setPhase] = useState("enter")
  const breakpoint = useCurrentBreakpoint()

  const ease = 300
  const breakpointScale = {
    base: 0.9,
    sm: 0.95,
    md: 1,
    lg: 1.05,
    xl: 1.1,
    "2xl": 1.15,
  }
  const phaseScale = {
    enter: 0.5,
    hold: 1,
    exit: 0.75,
  }

  const typeClasses = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  }

  useEffect(() => {
    setPhase("enter")

    const t1 = setTimeout(() => setPhase("hold"), ease)
    const t2 = setTimeout(
      () => setPhase("exit"),
      notification.options?.duration - ease || 2500,
    )

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [notification.id])

  const currentScale =
    (breakpointScale[breakpoint] || breakpointScale.md) * phaseScale[phase]

  return (
    <div
      className={`alert alert-vertical p-5 rounded-xl ${typeClasses[notification.type] || "alert-info"} transition-all duration-300 ease-out origin-center ${phase === "hold" ? "opacity-100" : "opacity-0"}`}
      style={{ transform: `scale(${currentScale})` }}>
      <h1 className="text-4xl text-center font-bold">{notification.message}</h1>
      {!notification.options?.payout ||
        (notification.options?.payout !== 0 && (
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-bold text-center">
              {notification.options?.payout}
            </h2>
            <IconCoinBitcoin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        ))}
    </div>
  )
}

export default GameNotification
