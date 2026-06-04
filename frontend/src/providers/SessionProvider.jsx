import React, { createContext, useContext, useEffect, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useNavigate } from "react-router-dom"
import { useLocale } from "./LocaleProvider"

const SessionContext = createContext()

const SessionProvider = ({ children }) => {
  const defaultUser = {}

  const [user, setUser] = useState(defaultUser)
  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(true)

  const { addNotification } = useNotification()
  const { t } = useLocale()
  const { get, post, put } = useAPI()
  const navigate = useNavigate()

  const getTokens = () => {
    const tokens = localStorage.getItem("tokens")
    return tokens ? JSON.parse(tokens) : {}
  }

  const getAccessToken = () => {
    const tokens = getTokens()
    return tokens.accessToken || null
  }

  const setAccessToken = (accessToken) => {
    const tokens = getTokens()

    localStorage.setItem(
      "tokens",
      JSON.stringify({
        ...tokens,
        accessToken,
      }),
    )
  }

  const getRefreshToken = () => {
    const tokens = getTokens()
    return tokens.refreshToken || null
  }

  const setRefreshToken = (refreshToken) => {
    const tokens = getTokens()

    localStorage.setItem(
      "tokens",
      JSON.stringify({
        ...tokens,
        refreshToken,
      }),
    )
  }

  const removeTokens = () => {
    localStorage.removeItem("tokens")
  }

  const register = async (data) => {
    try {
      const response = await post("/api/v1/auth/register", { body: data })

      if (response?.code !== "AUTH_USER_REGISTERED") {
        throw new Error(response?.code)
      }
      addNotification(t(`message.success.${response?.code}`), "success")
    } catch (error) {
      addNotification(t(`message.error.${error?.message}`), "error")
    } finally {
      setLoading(false)
    }
  }

  const login = async (data) => {
    try {
      const response = await post("/api/v1/auth/login", { body: data })

      if (response.code) {
        throw new Error(response?.code)
      }

      const { accessToken, refreshToken } = response

      setAccessToken(accessToken)
      setRefreshToken(refreshToken)

      addNotification(t("message.success.AUTH_USER_LOGGED"), "success")

      const userData = await getUserData()
      setUser(userData)
      setIsLogged(true)

      navigate("/home")
    } catch (error) {
      addNotification(t(`message.error.${error?.message}`), "error")
    } finally {
      setLoading(false)
    }
  }

  // TODO: Transicion brusca porque esta lo de protected route
  const logout = () => {
    navigate("/")
    removeTokens()
    setUser(defaultUser)
    setIsLogged(false)
    addNotification(t("message.success.logout"), "success")
  }

  const getUserData = async () => {
    try {
      const accessToken = getAccessToken()
      const refreshToken = getRefreshToken()
      const response = await get("/api/v1/user/me", {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
        },
      })

      if (response.code === "AUTH_INVALID_TOKEN") return

      if (response.code) {
        throw new Error(response?.code)
      }

      setUser(response)
      setIsLogged(true)
      return response
    } catch (error) {
      addNotification(t(`message.error.${error?.message}`), "error")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data) => {
    try {
      const accessToken = getAccessToken()

      // Sanitize payload: remove confirmPassword, trim password, and only send password when non-empty
      const body = { ...(data || {}) }
      if (body.confirmPassword !== undefined) {
        delete body.confirmPassword
      }

      if (body.password !== undefined) {
        const pwd = String(body.password).trim()
        if (pwd === "") {
          delete body.password
        } else {
          body.password = pwd
        }
      }

      const response = await put("/api/v1/user/me", {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${accessToken}`,
        },
        body: body,
      })

      if (!response || response.code !== "SUCCESS") {
        const message =
          response?.message ||
          (response?.errors
            ? response.errors
                .map((e) => e.message || JSON.stringify(e))
                .join(" \n")
            : response?.code || "UNKNOWN_ERROR")
        throw new Error(message)
      }

      addNotification(
        t ? t("message.success.USER_UPDATED") : "Profile updated",
        "success",
      )

      const userData = await getUserData()
      setUser(userData)

      return userData
    } catch (error) {
      addNotification(
        t ? t(`message.error.${error?.message}`) : "Error updating profile",
        "error",
      )
    } finally {
      setLoading(false)
    }
  }

  const addBalance = async (amount) => {
    try {
      const response = await post("/api/v1/user/me/transactions", {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: {
          type: "DEPOSIT",
          amount: amount,
        },
      })

      if (response.code) {
        throw new Error(response?.code)
      }

      updateBalance("deposit", amount)

      console.log("balance", response)

      addNotification(
        t(`message.success.BALANCE_ADDED_SUCCESSFULLY`),
        "success",
      )
    } catch (error) {
      addNotification(t(`message.error.${error?.message}`), "error")
    } finally {
      setLoading(false)
    }
  }

  const updateBalance = async (type, amount) => {
    try {
      setUser((prev) => {
        const currentBalance = parseFloat(prev.balance) || 0
        const parsedAmount = parseFloat(amount) || 0

        const newBalance =
          type === "deposit"
            ? currentBalance + parsedAmount
            : currentBalance - parsedAmount

        return {
          ...prev,
          balance: newBalance.toFixed(2),
        }
      })
    } catch (error) {
      addNotification(t(`message.error.${error?.message}`), "error")
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = () => {
    if (!user || Object.keys(user).length === 0) {
      return false
    }
    return user?.role === "admin"
  }

  useEffect(() => {
    const token = getAccessToken()

    if (token) {
      getUserData()
    } else {
      setLoading(false)
      setIsLogged(false)
    }
  }, [])

  const value = {
    register,
    login,
    logout,
    updateProfile,
    addBalance,
    updateBalance,
    user,
    isLogged,
    isAdmin,
    loading,
    getAccessToken,
    getRefreshToken,
    getUserData,
    setUser,
  }

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export default SessionProvider

export const useSession = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("Provider outside scope")
  }

  return context
}
