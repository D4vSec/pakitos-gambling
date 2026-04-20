import React from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import GameNotification from "./GameNotification.jsx"
import RouletteNotification from "./RouletteNotification.jsx"

const GameNotifications = () => {
  const { notifications } = useNotification()
  const games = notifications?.games || []

  return (
    <div className="absolute w-full h-full flex flex-col justify-center items-center gap-4 z-10 pointer-events-none">
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
