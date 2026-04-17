import React, { useEffect, useState } from "react"
import BitcoinSVG from "../svg/BitcoinSVG"

const GameNotification = ({ notification }) => {
  const [phase, setPhase] = useState("enter")

  const ease = 300

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

  return (
    <div
      className={`alert alert-vertical p-5 rounded-xl ${typeClasses[notification.type] || "alert-info"} transition-all duration-300 ease-out ${phase === "enter" ? "opacity-0 scale-50" : phase === "hold" ? "opacity-100 scale-100" : "opacity-0 scale-75"} origin-center`}>
      <h1 className="text-4xl text-center font-bold">{notification.message}</h1>
      {!notification.options?.payout ||
        (notification.options?.payout !== 0 && (
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-bold text-center">
              {notification.options?.payout}
            </h2>
            <BitcoinSVG />
          </div>
        ))}
    </div>
  )
}

export default GameNotification
