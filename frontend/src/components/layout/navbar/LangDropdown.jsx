import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { useNotification } from "@/providers/NotificationProvider"
import LanguageSVG from "@/components/svg/LanguageSVG"

const LangDropdown = ({ vertical = false }) => {
  const { t, loadLocale, lang } = useLocale()
  const { addNotification } = useNotification()

  const languages = [
    { key: "en", label: "English" },
    { key: "es", label: "Español" },
    { key: "ro", label: "Romanian" },
  ]

  const handleChangeLanguage = (newLang) => {
    if (newLang === lang) return
    loadLocale(newLang)
    addNotification(t("message.success.LANGUAGE_CHANGED"), "success")
  }

  return (
    <div className={`dropdown ${vertical ? "w-full" : "dropdown-end"}`}>
      <div
        tabIndex={0}
        role="button"
        className={`flex gap-2 items-center btn rounded-selector ${
          vertical ? "w-full justify-center" : "hover:bg-base-300"
        }`}>
        <LanguageSVG />
        <p>{lang?.toUpperCase()}</p>
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu bg-base-100 rounded-box mt-2 p-2 shadow ${
          vertical ? "w-full z-1" : "w-52 z-10"
        }`}>
        {languages.map(({ key, label }) => (
          <li key={key} onClick={() => handleChangeLanguage(key)}>
            <button
              className={`${key === lang ? "font-bold text-primary" : ""}`}>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LangDropdown
