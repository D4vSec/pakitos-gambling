"use strict"

import useAPI from "@/hooks/useAPI"
import { useNotification } from "@/providers/NotificationProvider"

const useAuth = () => {
    const { addNotification } = useNotification()
    const { post } = useAPI()

    const register = async (data) => {
        try {
            const response = await post("/api/v1/auth/register", data)
            console.log(response)
            addNotification("User registered correctly", "success")
        } catch (error) {
            addNotification("Couldn't register the new user", "error")
        }
    }

    const login = async (data) => {
        try {
            const response = await post("/api/v1/auth/login", data)
            console.log("ae", response)
            const a = response?.code === "AUTH_INVALID_CREDENTIALS" ? "error" : "success"
            addNotification(response?.code, a)
        } catch (error) {
            addNotification(error?.message, "error")
        }
    }

    return { register, login }
}

export default useAuth
