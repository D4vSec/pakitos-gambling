import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { useNotification } from "@/providers/NotificationProvider"
import SpanishFlagSVG from "@/components/svg/flags/SpanishFlagSVG"
import UKFlagSVG from "@/components/svg/flags/UKFlagSVG"
import RomainanFlagSVG from "@/components/svg/flags/RomainanFlagSVG"

const LangDropdown = ({ vertical = false }) => {
  const { t, loadLocale, lang } = useLocale()
  const { addNotification } = useNotification()

  const languages = [
    { key: "en", label: "English", svg: <UKFlagSVG /> },
    { key: "es", label: "Español", svg: <SpanishFlagSVG /> },
    { key: "ro", label: "Romanian", svg: <RomainanFlagSVG /> },
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
        {languages.find((l) => l.key === lang)?.svg}
        <p>{lang?.toUpperCase()}</p>
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu bg-base-100 rounded-box mt-2 p-2 shadow ${
          vertical ? "w-full z-1" : "w-52 z-10"
        }`}>
        {languages.map(({ key, label, svg }) => (
          <li key={key} onClick={() => handleChangeLanguage(key)}>
            <button
              className={`${key === lang ? "font-bold text-primary" : ""}`}>
              <span className="flex items-center gap-2">
                {svg}
                {label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LangDropdown
