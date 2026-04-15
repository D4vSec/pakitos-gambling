import React, { createContext, useState, useContext } from "react"

const NotificationContext = createContext()

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    global: [],
    games: [],
  })

  const addNotification = (message, type = "info", options = {}) => {
    const id = crypto.randomUUID()
    const duration = options.duration || 5000
    const scope = options.scope || "global"

    const notification = {
      id,
      message,
      type,
      options: {
        ...options,
        duration,
        scope,
      },
    }

    setNotifications((prev) => ({
      ...prev,
      [scope]: [...prev[scope], notification],
    }))

    // ⏱ solo auto-remove lógico (NO animación)
    if (type !== "modal" && type !== "input") {
      setTimeout(() => {
        removeNotification(id, scope)
      }, duration)
    }
  }

  const removeNotification = (id, scope = "games") => {
    // 1. marcar como saliendo
    setNotifications((prev) => ({
      ...prev,
      [scope]: prev[scope].map((n) =>
        n.id === id ? { ...n, leaving: true } : n,
      ),
    }))

    // 2. esperar animación y eliminar
    setTimeout(() => {
      setNotifications((prev) => ({
        ...prev,
        [scope]: prev[scope].filter((n) => n.id !== id),
      }))
    }, 500) // 👈 debe coincidir con duración animación
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
  if (!context) throw new Error("Provider outside scope")
  return context
}

export default NotificationProvider
