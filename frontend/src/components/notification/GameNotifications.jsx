import React, { useEffect } from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import GameNotification from "./GameNotification.jsx"
import RouletteNotification from "./RouletteNotification.jsx"

const GameNotifications = () => {
  const { notifications, removeNotification } = useNotification()
  const games = notifications?.games || []

  useEffect(() => {
    return () => {
      notifications.games.forEach((n) => {
        removeNotification(n.id, "games")
      })
    }
  }, [])

  return (
    <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center gap-4 pointer-events-none">
      {games.map((notification) => {
        switch (notification?.options?.game) {
          case "roulette":
            return (
              <RouletteNotification
                key={notification.id}
                notification={notification}
              />
            )

          default:
            return (
              <GameNotification
                key={notification.id}
                notification={notification}
              />
            )
        }
      })}
    </div>
  )
}

export default GameNotifications
