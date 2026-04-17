import React from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import GameNotification from "./GameNotification.jsx"

const GameNotifications = () => {
  const { notifications } = useNotification()
  const games = notifications?.games || []

  return (
    <div className="absolute w-full h-full flex flex-col justify-center items-center gap-4 z-10">
      {games.map((notification) => (
        <GameNotification key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

export default GameNotifications
