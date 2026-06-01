import React, { useEffect, useState } from "react"
import LastNumber from "../games/roulette/lastNums/LastNumber"
import { IconCoinBitcoin } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"
import useCurrentBreakpoint from "@/hooks/useCurrentBreakpoint"

const RouletteNotification = ({ notification }) => {
  const [phase, setPhase] = useState("enter")
  const breakpoint = useCurrentBreakpoint()

  const { t } = useLocale()

  const typeClasses = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  }

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

  const currentScale =
    (breakpointScale[breakpoint] || breakpointScale.md) * phaseScale[phase]

  return (
    <div
      className={`alert alert-vertical p-5 rounded-xl transition-all duration-300 ease-out origin-center
        ${typeClasses[notification.type]}
        ${phase === "hold" ? "opacity-100" : "opacity-0"}`}
      style={{ transform: `scale(${currentScale})` }}>
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
            <IconCoinBitcoin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default RouletteNotification
