import React, { createContext, useContext, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useNavigate } from "react-router-dom"
import { useLocale } from "./LocaleProvider"
const SessionContext = createContext()

const SessionProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const { addNotification } = useNotification()
    const { localeData, findMessage } = useLocale()
    const { post } = useAPI()

    const navigate = useNavigate()

    const register = async (data) => {
        try {
            const response = await post("/api/v1/auth/register", data)
            console.log(response)

            if (response?.code !== "AUTH_USER_REGISTERED") {
                throw new Error(findMessage(response?.code))
            }

            addNotification(t(`message.success.${response?.code}`), "success")
            addNotification(t("message.info.registered"), "success")
        } catch (error) {
            console.log(error)
            addNotification(error.message || error, "error")
        }
    }

    const login = async (data) => {
        try {
            const response = await post("/api/v1/auth/login", data)
            console.log("ae", response)

            // TODO: Cambiar cuando del david me ponga un code con el token
            if (response.code) {
                const msg =
                    findMessage(response.code, localeData) || response.message || "Unknown error"
                throw new Error(msg)
            }

            addNotification(findMessage("AUTH_USER_LOGGED", localeData), "success")
        } catch (error) {
            console.log("e", error)
            console.log("em", error.message)
            addNotification(
                findMessage(error.message, localeData?.message?.error) ||
                    error.message ||
                    "Error at the login",
                "error",
            )
        }
    }

    const box = { register, login }

    return <SessionContext value={box}>{children}</SessionContext>
}

export default SessionProvider

export const useSession = () => {
    const context = useContext(SessionContext)
    if (!context) {
        throw new Error("Provider outside scope")
    }
    return context
}
