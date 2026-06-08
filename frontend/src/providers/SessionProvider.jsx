import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
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
  const hasShownSessionExpiredModalRef = useRef(false)
  const sessionValidationRequestRef = useRef(null)

  const { addNotification } = useNotification()
  const { t } = useLocale()
  const { get, post, put } = useAPI()
  const navigate = useNavigate()

  const getTokens = () => {
    try {
      const tokens = localStorage.getItem("tokens")
      const parsedTokens = tokens ? JSON.parse(tokens) : {}
      return parsedTokens && typeof parsedTokens === "object"
        ? parsedTokens
        : {}
    } catch {
      removeTokens()
      return {}
    }
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

  const areCurrentTokens = (accessToken, refreshToken) => {
    const tokens = getTokens()
    return (
      tokens.accessToken === accessToken && tokens.refreshToken === refreshToken
    )
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
      hasShownSessionExpiredModalRef.current = false

      addNotification(t("message.success.AUTH_USER_LOGGED"), "success")

      const userData = await getUserData({ syncSession: false })
      if (!userData) return

      setUser(userData)
      setIsLogged(true)

      navigate("/home")
    } catch (error) {
      addNotification(t(`message.error.${error?.message}`), "error")
    } finally {
      setLoading(false)
    }
  }

  const logout = (options = {}) => {
    const { notify = true, redirectTo = "/" } = options
    navigate(redirectTo)
    removeTokens()
    setUser(defaultUser)
    setIsLogged(false)
    sessionValidationRequestRef.current = null
    hasShownSessionExpiredModalRef.current = false

    if (notify) {
      addNotification(t("message.success.logout"), "success")
    }
  }

  const showSessionExpiredModal = () => {
    if (hasShownSessionExpiredModalRef.current) return
    hasShownSessionExpiredModalRef.current = true
    addNotification(t("message.modal.sessionExpired.title"), "modal", {
      onAccept: () => logout({ notify: false, redirectTo: "/login" }),
      acceptLabel: t("message.modal.sessionExpired.accept"),
      showCancel: false,
    })
  }

  const isSessionEndedCode = (code) =>
    code === "AUTH_INVALID_SESSION" ||
    code === "AUTH_SESSION_EXPIRED" ||
    code === "AUTH_INVALID_REFRESH_TOKEN" ||
    code === "AUTH_NO_TOKEN_PROVIDED" ||
    code === "AUTH_INVALID_TOKEN"

  const finishSession = ({ notify = true } = {}) => {
    removeTokens()
    setUser(defaultUser)
    setIsLogged(false)
    sessionValidationRequestRef.current = null

    if (notify) {
      showSessionExpiredModal()
    }
  }

  const getTokenExpirationMs = (token) => {
    if (!token) return null

    try {
      const [, payload] = token.split(".")

      if (!payload) return null

      const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/")
      const paddedPayload = normalizedPayload.padEnd(
        normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
        "=",
      )
      const decodedPayload = JSON.parse(atob(paddedPayload))

      if (!decodedPayload?.exp) return null

      return decodedPayload.exp * 1000
    } catch {
      return null
    }
  }

  const getAccessTokenExpirationMs = () =>
    getTokenExpirationMs(getAccessToken())

  const getRefreshTokenExpirationMs = () =>
    getTokenExpirationMs(getRefreshToken())

  const getUserData = async ({
    notifySessionEnded = true,
    syncSession = true,
  } = {}) => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    try {
      if (!accessToken || !refreshToken) {
        finishSession({
          notify:
            notifySessionEnded &&
            isLogged &&
            Boolean(accessToken || refreshToken),
        })
        return null
      }

      const response = await get("/api/v1/user/me", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh-token": refreshToken,
        },
      })

      if (isSessionEndedCode(response?.code)) {
        if (areCurrentTokens(accessToken, refreshToken)) {
          finishSession({ notify: notifySessionEnded })
        }
        return null
      }

      if (response.code) {
        throw new Error(response?.code)
      }

      if (syncSession) {
        setUser(response)
        setIsLogged(true)
      }
      return response
    } catch (error) {
      if (isSessionEndedCode(error?.message)) {
        if (areCurrentTokens(accessToken, refreshToken)) {
          finishSession({ notify: notifySessionEnded })
        }
        return null
      }

      addNotification(t(`message.error.${error?.message}`), "error")
      return null
    } finally {
      setLoading(false)
    }
  }

  const validateCurrentSession = async ({ notifySessionEnded = true } = {}) => {
    if (sessionValidationRequestRef.current) {
      return sessionValidationRequestRef.current
    }

    sessionValidationRequestRef.current = getUserData({ notifySessionEnded })
      .finally(() => {
        sessionValidationRequestRef.current = null
      })

    return sessionValidationRequestRef.current
  }

  const handleSessionEndedResponse = (code) => {
    if (!isSessionEndedCode(code)) return false

    finishSession()
    return true
  }

  const resolveProfileValidationKey = (issue) => {
    const field = issue?.path?.[0]

    if (field === "username") {
      if (issue?.code === "too_small") return "forms.fields.username.minLength"
      if (issue?.code === "too_big") return "forms.fields.username.maxLength"
    }

    if (field === "email") {
      return "forms.fields.email.pattern"
    }

    if (field === "password" && issue?.code === "too_small") {
      return "forms.fields.password.minLength"
    }

    if (field === "currentPassword" && issue?.code === "too_small") {
      return "forms.fields.password.currentRequired"
    }

    return null
  }

  const resolveProfileUpdateErrorMessage = (responseOrError) => {
    const issues = responseOrError?.errors

    if (Array.isArray(issues) && issues.length > 0) {
      const validationKey = resolveProfileValidationKey(issues[0])
      if (validationKey) return t(validationKey)

      if (typeof issues[0]?.message === "string" && issues[0].message.trim()) {
        return issues[0].message
      }
    }

    if (responseOrError?.code) {
      return t(`message.error.${responseOrError.code}`)
    }

    if (
      typeof responseOrError?.message === "string" &&
      responseOrError.message.trim()
    ) {
      return responseOrError.message
    }

    return t("message.error.SERVER_ERROR")
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

      if (handleSessionEndedResponse(response?.code)) return null

      if (!response || response.code !== "SUCCESS") {
        throw response || new Error("SERVER_ERROR")
      }

      addNotification(
        t ? t("message.success.USER_UPDATED") : "Profile updated",
        "success",
      )

      const userData = await getUserData()
      setUser(userData)

      return userData
    } catch (error) {
      if (handleSessionEndedResponse(error?.code || error?.message)) return null

      addNotification(
        resolveProfileUpdateErrorMessage(error),
        "error",
      )
      return null
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

      if (handleSessionEndedResponse(response?.code)) return

      if (response.code) {
        throw new Error(response?.code)
      }

      updateBalance("deposit", amount)

      addNotification(
        t(`message.success.BALANCE_ADDED_SUCCESSFULLY`),
        "success",
      )
    } catch (error) {
      if (handleSessionEndedResponse(error?.message)) return

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
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (accessToken && refreshToken) {
      validateCurrentSession()
    } else if (accessToken || refreshToken) {
      finishSession({ notify: false })
      setLoading(false)
    } else {
      setLoading(false)
      setIsLogged(false)
    }
    // Session restoration should only run once when the provider mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isLogged) return

    const checkTokenExpiration = async () => {
      const accessToken = getAccessToken()
      const refreshToken = getRefreshToken()
      const accessExpirationMs = getAccessTokenExpirationMs()
      const refreshExpirationMs = getRefreshTokenExpirationMs()

      if (!accessToken || !refreshToken) {
        finishSession()
        return
      }

      if (!accessExpirationMs || !refreshExpirationMs) {
        finishSession()
        return
      }

      if (Date.now() >= refreshExpirationMs) {
        finishSession()
        return
      }

      if (Date.now() < accessExpirationMs) return

      await validateCurrentSession()
    }

    const intervalId = window.setInterval(() => {
      checkTokenExpiration()
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
    // The watcher lifecycle is controlled by the logged-in state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged])

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
    showSessionExpiredModal,
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
