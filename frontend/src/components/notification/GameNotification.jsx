import React, { useEffect, useState } from "react"
import { IconCoinBitcoin } from "@tabler/icons-react"

const GameNotification = ({ notification }) => {
  const [phase, setPhase] = useState("enter")

  const ease = 300
  const phaseScale = {
    enter: 0.5,
    hold: 1,
    exit: 0.75,
  }
  const exitDelay = notification.options?.duration - ease || 2500

  const typeClasses = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  }
  const duration = notification.options?.duration || 2800

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), ease)
    const t2 = setTimeout(() => setPhase("exit"), duration - ease)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [duration, notification.id])

  return (
    <div
      className={`alert alert-vertical p-5 rounded-xl ${typeClasses[notification.type] || "alert-info"} transition-all duration-300 ease-out origin-center [--notification-breakpoint-scale:0.9] sm:[--notification-breakpoint-scale:0.95] md:[--notification-breakpoint-scale:1] lg:[--notification-breakpoint-scale:1.05] xl:[--notification-breakpoint-scale:1.1] 2xl:[--notification-breakpoint-scale:1.15] ${phase === "hold" ? "opacity-100" : "opacity-0"}`}
      style={{
        transform: `scale(calc(var(--notification-breakpoint-scale) * ${phaseScale[phase]}))`,
      }}>
      <h1 className="text-4xl text-center font-bold">{notification.message}</h1>
      {!notification.options?.payout ||
        (notification.options?.payout !== 0 && (
          <div className="flex items-center gap-1">
            <h2 className="text-lg sm:text-xl lg:text-[1.35rem] xl:text-[1.45rem] 2xl:text-2xl font-bold text-center">
              {notification.options?.payout}
            </h2>
            <IconCoinBitcoin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        ))}
    </div>
  )
}

export default GameNotification
