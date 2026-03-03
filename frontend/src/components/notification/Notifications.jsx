import React from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import Notification from "./Notification.jsx"
import NotificationModal from "./NotificationModal.jsx"

const Notifications = () => {
    const { notifications } = useNotification()

    if (!notifications || notifications.length === 0) return null

    return (
        <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
            {notifications.map((notification) => {
                switch (notification?.type) {
                    case "modal":
                        return (
                            <NotificationModal key={notification.id} notification={notification} />
                        )
                    default:
                        return <Notification key={notification.id} notification={notification} />
                }
            })}
        </div>
    )
}

export default Notifications
