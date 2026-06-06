import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { useNotification } from "@/providers/NotificationProvider"
import SpanishFlagSVG from "@/components/svg/flags/SpanishFlagSVG"
import UKFlagSVG from "@/components/svg/flags/UKFlagSVG"
import RomainanFlagSVG from "@/components/svg/flags/RomainanFlagSVG"
import Button from "@/components/buttons/Button"

const LangDropdown = ({ vertical = false }) => {
  const { loadLocale, lang, getTranslation } = useLocale()
  const { addNotification } = useNotification()

  const languages = [
    { key: "en", label: "English", svg: <UKFlagSVG /> },
    { key: "es", label: "Spanish", svg: <SpanishFlagSVG /> },
    { key: "ro", label: "Romanian", svg: <RomainanFlagSVG /> },
  ]

  const handleChangeLanguage = async (newLang) => {
    if (newLang === lang) return

    const localeMessages = await loadLocale(newLang)
    if (!localeMessages) return

    addNotification(
      getTranslation(localeMessages, "message.success.LANGUAGE_CHANGED"),
      "success",
    )
  }

  return (
    <div className={`dropdown ${vertical ? "w-full" : "dropdown-end"}`}>
      <div
        tabIndex={0}
        role="button"
        className={`flex gap-2 items-center btn rounded-selector ${
          vertical ? "w-full justify-center" : "hover:bg-base-300"
        }`}>
        {languages.find((item) => item.key === lang)?.svg}
        <p>{lang?.toUpperCase()}</p>
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu bg-base-100 rounded-box mt-2 p-2 shadow ${
          vertical ? "w-full z-1" : "w-52 z-10"
        }`}>
        {languages.map(({ key, label, svg }) => (
          <li key={key} onClick={() => handleChangeLanguage(key)}>
            <Button
              type="button"
              unstyled
              className={`${key === lang ? "font-bold text-primary" : ""}`}>
              <span className="flex items-center gap-2">
                {svg}
                {label}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LangDropdown
