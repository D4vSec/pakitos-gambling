import React, { createContext, useState, useContext } from "react"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"

const NotificationContext = createContext()

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    global: [],
    games: [],
  })

  const location = useLocation()

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

    if (type !== "modal" && type !== "input") {
      setTimeout(() => {
        removeNotification(id, scope)
      }, duration)
    }
  }

  const removeNotification = (id, scope = "games") => {
    setNotifications((prev) => ({
      ...prev,
      [scope]: prev[scope].map((n) =>
        n.id === id ? { ...n, leaving: true } : n,
      ),
    }))

    setTimeout(() => {
      setNotifications((prev) => ({
        ...prev,
        [scope]: prev[scope].filter((n) => n.id !== id),
      }))
    }, 500)
  }

  const gameRoutes = [
    "/roulette0",
    "/roulette00",
    "/slots",
    "/slots3x5",
    "/slots5x5",
    "/blackjack",
    "/capyroad",
  ]

  const isGameRoute = gameRoutes.some((route) =>
    location.pathname.startsWith(route),
  )

  useEffect(() => {
    if (!isGameRoute) {
      setNotifications((prev) => ({
        ...prev,
        games: [],
      }))
    }
  }, [location.pathname])

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
