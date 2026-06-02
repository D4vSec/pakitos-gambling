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

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), ease)
    const t2 = setTimeout(() => setPhase("exit"), exitDelay)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [exitDelay, notification.id])

  return (
    <div
      className={`alert alert-vertical p-5 rounded-xl ${typeClasses[notification.type] || "alert-info"} transition-all duration-300 ease-out origin-center ${phase === "hold" ? "opacity-100" : "opacity-0"}`}
      style={{ transform: `scale(${phaseScale[phase]})` }}>
      <h1 className="text-[2rem] sm:text-[2.15rem] md:text-4xl lg:text-[2.4rem] xl:text-[2.5rem] 2xl:text-[2.6rem] text-center font-bold">
        {notification.message}
      </h1>
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
