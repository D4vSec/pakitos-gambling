import React, { useEffect, useState } from "react"
import LastNumber from "../games/roulette/lastNums/LastNumber"
import BitcoinSVG from "../svg/BitcoinSVG"
import { useLocale } from "@/providers/LocaleProvider"

const RouletteNotification = ({ notification }) => {
  const [phase, setPhase] = useState("enter")
  console.log(notification)
  const { t } = useLocale()

  const typeClasses = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  }

  const ease = 300

  useEffect(() => {
    setPhase("enter")

    const t1 = setTimeout(() => setPhase("hold"), ease)
    const t2 = setTimeout(
      () => setPhase("exit"),
      notification.options?.duration - ease || 2700,
    )

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [notification.id])

  return (
    <div
      className={`alert alert-vertical p-5 rounded-xl transition-all duration-300 ease-out origin-center
        ${typeClasses[notification.type]}
        ${
          phase === "enter"
            ? "opacity-0 scale-50"
            : phase === "hold"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75"
        }`}>
      <div className="flex flex-col items-center gap-2">
        <LastNumber number={notification.options?.number} />

        <h1 className="text-3xl font-bold text-center">
          {t(`games.result.${notification.options?.outcome}`)}
        </h1>

        {notification.options?.payout > 0 && (
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-bold text-center">
              +{notification.options.payout}
            </h2>
            <BitcoinSVG />
          </div>
        )}
      </div>
    </div>
  )
}

export default RouletteNotification
