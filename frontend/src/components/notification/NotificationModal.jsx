import React from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import Button from "@/components/buttons/Button.jsx"

const NotificationModal = ({ notification }) => {
    const { removeNotification } = useNotification()

    const accept = () => {
        notification?.onAccept?.()
        removeNotification(notification.id)
    }

    const cancel = () => {
        removeNotification(notification.id)
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-base-200 p-8 rounded-xl w-96 text-center shadow-lg">
                <p className="text-lg mb-6 text-base-content">{notification.message}</p>
                <div className="flex justify-around">
                    <Button variant="error" onClick={accept} className="w-1/3">
                        Yes
                    </Button>
                    <Button variant="neutral" onClick={cancel} className="w-1/3">
                        No
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotificationModal
