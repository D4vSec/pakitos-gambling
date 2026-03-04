import React, { createContext, useContext, useEffect, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useNavigate } from "react-router-dom"
import { useLocale } from "./LocaleProvider"
const SessionContext = createContext()

const SessionProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isLogged, setIsLogged] = useState(false)
    const [loading, setLoading] = useState(true)

    const { addNotification } = useNotification()
    const { t } = useLocale()
    const { post } = useAPI()

    const navigate = useNavigate()

    const register = async (data) => {
        try {
            const response = await post("/api/v1/auth/register", data)
            console.log(response)

            if (response?.code !== "AUTH_USER_REGISTERED") {
                throw new Error(t(`message.error.${response?.code}`))
            }

            addNotification(t(`message.success.${response?.code}`), "success")
            addNotification(t("message.info.registered"), "info", 7000)
            navigate("/login")
        } catch (error) {
            addNotification(t(`message.error.${error?.message}`) || error?.message, "error")
        }
    }

    const login = async (data) => {
        try {
            const response = await post("/api/v1/auth/login", data)
            console.log("ae", response)

            // TODO: Cambiar cuando del david me ponga un code con el token
            if (response.code) {
                throw new Error(t(`message.error.${response?.code}`))
            }

            addNotification(t(`message.success.${"AUTH_USER_LOGGED"}`), "success")
        } catch (error) {
            addNotification(t(`message.error.${error?.message}`) || error?.message, "error")
        }
    }

    const value = { register, login }

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
