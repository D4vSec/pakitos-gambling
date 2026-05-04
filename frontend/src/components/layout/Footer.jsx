import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

const Footer = () => {
  const { t } = useLocale()
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-200 text-base-content p-4">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - {t("app.copyright")}
        </p>
      </aside>
    </footer>
  )
}

export default Footer
