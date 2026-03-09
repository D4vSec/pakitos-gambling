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
    const { get, post } = useAPI()
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
            const response = await post("/api/v1/auth/register", data)

            if (response?.code !== "AUTH_USER_REGISTERED") {
                throw new Error(response?.code)
            }

            addNotification(t(`message.success.${response?.code}`), "success")
            addNotification(t("message.info.registered"), "info", 7000)

            navigate("/login")
        } catch (error) {
            addNotification(t(`message.error.${error?.message}`), "error")
        }
    }

    const login = async (data) => {
        try {
            const response = await post("/api/v1/auth/login", data)

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
        }
    }

    const logout = () => {
        removeTokens()
        setUser(defaultUser)
        setIsLogged(false)
        addNotification(t("message.success.logout"), "success")
        navigate("/")
    }

    const getUserData = async () => {
        try {
            const accessToken = getAccessToken()

            if (!accessToken) return null

            const response = await get("/api/v1/user/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

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

    useEffect(() => {
        const token = getAccessToken()

        if (token) {
            getUserData()
        } else {
            setLoading(false)
        }
    }, [])

    const value = {
        register,
        login,
        logout,
        user,
        isLogged,
        loading,
        getAccessToken,
        getRefreshToken,
    }

    return <SessionContext value={value}>{children}</SessionContext>
}

export default SessionProvider

export const useSession = () => {
    const context = useContext(SessionContext)

    if (!context) {
        throw new Error("Provider outside scope")
    }

    return context
}
