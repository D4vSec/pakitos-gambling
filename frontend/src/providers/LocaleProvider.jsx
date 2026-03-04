import React, { createContext, useContext, useEffect, useState } from "react"

const LocaleContext = createContext()

const LocaleProvider = ({ children }) => {
    const [localeData, setLocaleData] = useState({})
    const [loading, setLoading] = useState(true)

    const loadLocale = async (lang) => {
        try {
            const response = await fetch(`./locales/${lang}.json`)
            const data = await response.json()
            setLocaleData(data)
            setLoading(false)
            return true
        } catch (err) {
            console.error("Error loading locale", err)
            return false
        }
    }

    const t = (key, vars = {}) => {
        let text = key.split(".").reduce((obj, i) => (obj ? obj[i] : null), localeData)
        if (!text || typeof text !== "string") return key

        Object.keys(vars).forEach((v) => {
            text = text.replace(new RegExp(`{{${v}}}`, "g"), vars[v])
        })
        return text
    }

    const findMessage = (targetKey, obj = localeData) => {
        console.log("Buscando clave:", targetKey)
        console.log("type", typeof targetKey)
        // Convertir número a string
        if (typeof targetKey === "number") targetKey = String(targetKey)

        for (const key in obj) {
            console.log("Revisando key:", key)

            if (key === targetKey) {
                console.log("¡Clave encontrada!", key, "→", obj[key])
                return obj[key]
            }

            if (typeof obj[key] === "object" && obj[key] !== null) {
                console.log("Descendiendo en objeto:", key)
                const result = findMessage(targetKey, obj[key])
                if (result !== undefined) {
                    return result
                }
            }
        }

        console.log("Clave no encontrada en este nivel:", targetKey)
        return `Value of ${targetKey} not found`
    }

    useEffect(() => {
        loadLocale("en")
    }, [])

    return <LocaleContext value={{ t, loadLocale, findMessage, loading }}>{children}</LocaleContext>
}

export default LocaleProvider

export const useLocale = () => {
    const context = useContext(LocaleContext)
    if (!context) {
        throw new Error("Provider outside scope")
    }
    return context
}
