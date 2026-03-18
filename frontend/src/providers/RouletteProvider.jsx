import React, { createContext, useContext, useEffect, useState } from "react"
import { useNotification } from "@/providers/NotificationProvider"
import useAPI from "@/hooks/useAPI"
import { useSession } from "./SessionProvider"

const RouletteContext = createContext()

const HOST = "localhost:3000"

const RouletteProvider = ({ children }) => {
    const [winningNums, setWinningNums] = useState([])
    const { getRefreshToken, getAccessToken } = useSession()
    const { addNotification } = useNotification()
    const { post } = useAPI()

    const spin = async (data) => {
        /*
{
    "rouletteType": "ZeroZero",
    "bets": [
        {
            "type": "twelve",
            "bet": "1-12",
            "amount": 10
        },
                {
            "type": "color",
            "bet": "red",
            "amount": 10
        }
    ]
}
        */
        const url = `http://${HOST}/v1/roulette/spin`
        try {
            const res = await post(url, {
                headers: {
                    "x-refresh-token": getRefreshToken(),
                    Authorization: `Bearer ${getAccessToken()}`,
                },
                body: data,
            })

            if (res.code) {
                throw new Error(res.code)
            }
        } catch (error) {
            addNotification(error.message, "error")
        }
    }
    const value = { spin }

    return <RouletteContext value={value}>{children}</RouletteContext>
}

export default RouletteProvider

export const useRoulette = () => {
    const context = useContext(RouletteContext)

    if (!context) {
        throw new Error("Provider outside scope")
    }

    return context
}
