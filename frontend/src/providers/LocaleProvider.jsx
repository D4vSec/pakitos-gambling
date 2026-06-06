import React, { createContext, useContext, useEffect, useState } from "react"

const LocaleContext = createContext()

const getTranslation = (messages, key, vars = {}) => {
  let text = key
    .split(".")
    .reduce((obj, i) => (obj !== undefined && obj !== null ? obj[i] : null), messages)

  if (!text || typeof text !== "string") return key

  Object.keys(vars).forEach((v) => {
    text = text.replace(new RegExp(`{{${v}}}`, "g"), vars[v])
  })

  return text
}

const LocaleProvider = ({ children }) => {
  const [localeData, setLocaleData] = useState({})
  const [loading, setLoading] = useState(true)

  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "es"
  })

  const loadLocale = async (newLang) => {
    try {
      const response = await fetch(`/locales/${newLang}.json`)
      const data = await response.json()

      setLocaleData(data)
      setLoading(false)

      if (localStorage.getItem("lang") !== newLang) {
        localStorage.setItem("lang", newLang)
      }

      setLang(newLang)

      return data
    } catch (err) {
      console.error("Error loading locale", err)
      return null
    }
  }

  const t = (key, vars = {}) => getTranslation(localeData, key, vars)

  useEffect(() => {
    loadLocale(lang)
  }, [])

  return (
    <LocaleContext.Provider value={{ t, loadLocale, loading, lang, getTranslation }}>
      {children}
    </LocaleContext.Provider>
  )
}

export default LocaleProvider

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("Provider outside scope")
  }
  return context
}
