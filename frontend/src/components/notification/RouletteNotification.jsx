import React, { useEffect, useState } from "react"
import LastNumber from "../games/roulette/lastNums/LastNumber"
import { IconCoinBitcoin } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"

const RouletteNotification = ({ notification }) => {
  const [phase, setPhase] = useState("enter")

  const { t } = useLocale()

  const typeClasses = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  }

  const ease = 300
  const phaseScale = {
    enter: 0.5,
    hold: 1,
    exit: 0.75,
  }
  const duration = notification.options?.duration || 3000

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
      className={`alert alert-vertical p-5 rounded-xl transition-all duration-300 ease-out origin-center
        [--notification-breakpoint-scale:0.9] sm:[--notification-breakpoint-scale:0.95] md:[--notification-breakpoint-scale:1] lg:[--notification-breakpoint-scale:1.05] xl:[--notification-breakpoint-scale:1.1] 2xl:[--notification-breakpoint-scale:1.15]
        ${typeClasses[notification.type]}
        ${phase === "hold" ? "opacity-100" : "opacity-0"}`}
      style={{
        transform: `scale(calc(var(--notification-breakpoint-scale) * ${phaseScale[phase]}))`,
      }}>
      <div className="flex flex-col items-center gap-2">
        <LastNumber number={notification.options?.number} />

        <h1 className="text-[1.7rem] sm:text-[1.8rem] md:text-3xl lg:text-[2rem] xl:text-[2.1rem] 2xl:text-[2.15rem] font-bold text-center">
          {t(`games.result.${notification.options?.outcome}`)}
        </h1>

        {notification.options?.payout > 0 && (
          <div className="flex items-center gap-1">
            <h2 className="text-lg sm:text-xl lg:text-[1.35rem] xl:text-[1.45rem] 2xl:text-2xl font-bold text-center">
              +{notification.options.payout}
            </h2>
            <IconCoinBitcoin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default RouletteNotification
