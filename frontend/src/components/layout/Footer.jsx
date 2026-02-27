import React from "react"
import { useLocale } from "../../providers/LocaleProvider"

const Footer = () => {
    const { t } = useLocale()
    return (
        <footer className=" footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
            <aside>
                <p>
                    Copyright © {new Date().getFullYear()} - {t("general.copyright")}
                </p>
            </aside>
        </footer>
    )
}

export default Footer
