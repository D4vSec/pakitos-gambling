import React, { createContext, useState, useContext } from "react"

const NotificationContext = createContext()

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const addNotification = (message, type = "info", options = {}) => {
        const id = crypto.randomUUID()

        const duration = 5000

        const notification = {
            id,
            message,
            type,
            options: {
                ...options,
                duration,
            },
        }

        console.log("n", notification)

        setNotifications((prev) => [...prev, notification])

        if (type !== "modal" && type !== "input") {
            setTimeout(() => {
                removeNotification(id)
            }, notification?.options?.duration)
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

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
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
