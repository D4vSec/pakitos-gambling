import React, { createContext, useContext, useEffect, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useNavigate } from "react-router-dom"
import { useLocale } from "./LocaleProvider"
const SessionContext = createContext()

const SessionProvider = ({ children }) => {
    const defaultUser = {}
    const defaultAccessToken = ""

    const [user, setUser] = useState(defaultUser)
    const [accessToken, setAccessToken] = useState(defaultAccessToken)
    // Refresh token in localStorage
    const [isLogged, setIsLogged] = useState(false)
    const [loading, setLoading] = useState(true)

    const { addNotification } = useNotification()
    const { t } = useLocale()

    const { get, post, put, patch, destroy } = useAPI()

    const navigate = useNavigate()

    const setRefreshToken = (refreshToken) => {
        localStorage.setItem("refreshToken", refreshToken)
        return refreshToken
    }

    const getRefreshToken = () => {
        const refreshToken = localStorage.getItem("refreshToken")
        return refreshToken || null
    }

    const removeRefreshToken = () => {
        localStorage.removeItem("refreshToken")
    }

    const register = async (data) => {
        try {
            const response = await post("/api/v1/auth/register", data)
            console.log(response)

            if (response?.code !== "AUTH_USER_REGISTERED") {
                throw new Error(response?.code)
            }

            addNotification(t(`message.success.${response?.code}`), "success")
            addNotification(t("message.info.registered"), "info", 7000)
            navigate("/login")
        } catch (error) {
            addNotification(error?.message, "error")
        }
    }

    const login = async (data) => {
        try {
            const response = await post("/api/v1/auth/login", data)
            console.log("res", response)

            if (response.code) {
                throw new Error(response?.code)
            }

            const { accessToken, refreshToken } = response

            setAccessToken(accessToken)
            setRefreshToken(refreshToken)
            setIsLogged(true)

            addNotification(t(`message.success.AUTH_USER_LOGGED`), "success")

            const user = await getUserData()
            console.log("user", user)
            setUser(user)

            navigate("/home")
        } catch (error) {
            addNotification(error?.message, "error")
        }
    }

    const logout = () => {
        removeRefreshToken()
        setAccessToken(defaultAccessToken)
        setUser(defaultUser)
        setIsLogged(false)
        addNotification(t("message.success.logout"), "success")
        navigate("/")
    }

    const getUserData = async () => {
        // TODO: Se pierde el accToken al F5, hay veces que me indica
        // unauthorized
        try {
            console.log("acc", accessToken)
            const response = await get("/api/v1/user/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            console.log("rr", response)
            if (response.code) {
                throw new Error(response?.code)
            }

            setUser(response)
            setIsLogged(true)
        } catch (error) {
            addNotification(error?.message, "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const storedRefreshToken = getRefreshToken()

        if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken)
        }

        setLoading(false)
    }, [])

    const value = {
        register,
        login,
        logout,
        user,
        accessToken,
        isLogged,
        loading,
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
