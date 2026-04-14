import React from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import GameNotification from "./GameNotification.jsx"

const GameNotifications = () => {
  const { notifications } = useNotification()

  if (!notifications?.games?.length) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="flex flex-col gap-4">
        {notifications.games.map((notification) => (
          <GameNotification key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}

export default GameNotifications
