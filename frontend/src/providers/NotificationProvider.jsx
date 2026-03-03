import React, { createContext, useState, useContext } from "react"

const NotificationContext = createContext()

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const addNotification = (message, type = "info", duration = 4000, options = {}) => {
        const id = crypto.randomUUID()

        const notification = {
            id,
            message,
            type,
            duration,
            ...options,
        }

        setNotifications((prev) => [...prev, notification])

        if (type !== "modal" && type !== "input") {
            setTimeout(() => {
                removeNotification(id)
            }, duration)
        }
    }

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const value = {
        notifications,
        addNotification,
        removeNotification,
    }

    return <NotificationContext value={value}>{children}</NotificationContext>
}

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("Provider outside scope")
    }
    return context
}

export default NotificationProvider
export { NotificationContext }
