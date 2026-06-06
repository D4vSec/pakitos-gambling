import React from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import Notification from "./Notification.jsx"
import NotificationModal from "./NotificationModal.jsx"

const Notifications = () => {
  const { notifications } = useNotification()

  const global = notifications?.global || []
  const modals = global.filter((notification) => notification?.type === "modal")
  const toasts = global.filter((notification) => notification?.type !== "modal")

  if (global.length === 0) return null

  return (
    <>
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed left-4 top-[4.5rem] z-9999 flex w-[calc(100vw-2rem)] max-w-md flex-col items-start gap-2 sm:top-20">
          {toasts.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {modals.map((notification) => (
        <NotificationModal key={notification.id} notification={notification} />
      ))}
    </>
  )
}

export default Notifications
