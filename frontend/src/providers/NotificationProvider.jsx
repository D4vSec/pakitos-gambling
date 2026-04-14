import React, { createContext, useState, useContext } from "react"

const NotificationContext = createContext()

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    global: [],
    games: [],
  })

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
        scope: options.scope || "global",
      },
    }

    const scope = notification.options.scope

    setNotifications((prev) => ({
      ...prev,
      [scope]: [...prev[scope], notification],
    }))

    if (type !== "modal" && type !== "input") {
      setTimeout(() => {
        removeNotification(id, scope)
      }, duration)
    }
  }

  const removeNotification = (id, scope = "global") => {
    setNotifications((prev) => ({
      ...prev,
      [scope]: prev[scope].filter((n) => n.id !== id),
    }))
  }

  const value = {
    notifications,
    addNotification,
    removeNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
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
