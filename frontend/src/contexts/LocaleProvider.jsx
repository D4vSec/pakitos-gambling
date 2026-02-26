import React, { createContext, useContext, useState } from "react"

const LocaleContext = createContext()

export const LocaleProvider = ({ children }) => {
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

    return <LocaleContext value={{ t, loadLocale, loading }}>{children}</LocaleContext>
}

export const useLocale = () => {
    const context = useContext(LocaleContext)
    if (!context) {
        throw new Error("Provider outside scope")
    }
    return context
}
