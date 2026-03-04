import React, { createContext, useContext, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useNavigate } from "react-router-dom"

const SessionContext = createContext()

const SessionProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const { addNotification } = useNotification()
    const { post } = useAPI()

    const navigate = useNavigate()

    const register = async (data) => {
        try {
            const response = await post("/api/v1/auth/register", data)
            console.log(response)
            if (response.code === "AUTH_USER_REGISTERED") {
                addNotification("User registered correctly", "success")
                //navigate("/login")
            } else {

            }
        } catch (error) {
            addNotification("Couldn't register the new user", "error")
        }
    }

    const login = async (data) => {
        try {
            const response = await post("/api/v1/auth/login", data)
            console.log("ae", response)
            const a = response.code === "AUTH_INVALID_CREDENTIALS" ? "error" : "success"
            addNotification(response?.code, a)
        } catch (error) {
            addNotification(error?.message, "error")
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
