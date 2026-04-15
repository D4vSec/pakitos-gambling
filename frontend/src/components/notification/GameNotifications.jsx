import React, { useEffect, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import GameNotification from "./GameNotification.jsx"

const ANIMATION_DURATION = 500

const GameNotifications = () => {
  const { notifications } = useNotification()
  const games = notifications?.games || []
  const [renderOverlay, setRenderOverlay] = useState(false)
  const hasGames = games.length > 0

  useEffect(() => {
    if (hasGames) {
      setRenderOverlay(true)
    } else {
      const t = setTimeout(() => {
        setRenderOverlay(false)
      }, ANIMATION_DURATION)
      return () => clearTimeout(t)
    }
  }, [hasGames])

  if (!hasGames && !renderOverlay) return null

  return (
    <div
      className={`
        absolute inset-0 z-50
        flex items-center justify-center
        transition-opacity duration-300 ease-out
        ${hasGames ? "opacity-100" : "opacity-0"}
      `}>
      <div
        className={`
          absolute inset-0
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 ease-out
          ${hasGames ? "opacity-100" : "opacity-0"}
        `}
      />

      <div className="relative flex flex-col gap-4 z-10">
        {games.map((notification) => (
          <GameNotification key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

export default GameNotifications
