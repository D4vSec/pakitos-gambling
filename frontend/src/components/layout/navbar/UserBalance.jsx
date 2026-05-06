import React, { useEffect, useRef, useState } from "react"
import Button from "@/components/buttons/Button"
import { useSession } from "@/providers/SessionProvider"
import BitcoinSVG from "@/components/svg/pictures/BitcoinSVG"

const ANIMATION_DURATION = 800

const UserBalance = () => {
  const { user } = useSession()

  const targetBalance = Number(user?.balance ?? 0)

  const [displayBalance, setDisplayBalance] = useState(targetBalance)
  const [delta, setDelta] = useState(null)
  const [animating, setAnimating] = useState(false)

  const prevRef = useRef(targetBalance)

  useEffect(() => {
    const prev = prevRef.current

    if (prev === targetBalance) return

    const difference = targetBalance - prev

    setDelta(difference)
    setAnimating(true)

    const start = performance.now()

    const animate = (time) => {
      const progress = Math.min((time - start) / ANIMATION_DURATION, 1)
      const value = prev + difference * progress
      setDisplayBalance(value)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setAnimating(false)
      }
    }
    requestAnimationFrame(animate)
    prevRef.current = targetBalance
    const t = setTimeout(() => {
      setDelta(null)
    }, ANIMATION_DURATION + 300)

    return () => clearTimeout(t)
  }, [targetBalance])

  const bgClass = animating
    ? delta > 0
      ? "bg-green-500/80 shadow-[0_0_25px_rgba(34,197,94,0.4)]"
      : "bg-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
    : "bg-base-200"

  return (
    <Button
      variant="neutral"
      className={`
        relative overflow-visible
        font-bold
        transition-all duration-300
        ${bgClass}
      `}>
      <span className="flex items-center gap-2 text-lg">
        {displayBalance.toFixed(2)}
        <BitcoinSVG />
      </span>

      {delta !== null && (
        <span
          className={`
            absolute -top-2 -right-2
            text-xs font-bold
            px-2 py-1 rounded-full
            transition-all duration-300
            ${delta > 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"}
            animate-bounce
          `}>
          {delta > 0 ? `+${delta.toFixed(2)}` : `${delta.toFixed(2)}`}
        </span>
      )}

      {animating && (
        <div
          className={`
            absolute inset-0
            pointer-events-none
            animate-pulse
            ${delta > 0 ? "bg-green-400/10" : "bg-red-400/10"}
          `}
        />
      )}
    </Button>
  )
}

export default UserBalance
