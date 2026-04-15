import React from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import Notification from "./Notification.jsx"
import NotificationModal from "./NotificationModal.jsx"

const Notifications = () => {
  const { notifications } = useNotification()

  const global = notifications?.global || []

  if (global.length === 0) return null

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50">
      {global.map((notification) => {
        switch (notification?.type) {
          case "modal":
            return (
              <NotificationModal
                key={notification.id}
                notification={notification}
              />
            )

          default:
            return (
              <Notification key={notification.id} notification={notification} />
            )
        }
      })}
    </div>
  )
}

export default Notifications
