import React from "react"
import Button from "../buttons/Button"
import { useLocale } from "../../providers/LocaleProvider"
import { useNavigate } from "react-router-dom"
import UserDropdown from "./UserDropdown"

const NavbarBtns = ({ className = "", vertical = false }) => {
    const { t } = useLocale()
    const navigate = useNavigate()

    const buttons = [
        {
            key: "register",
            label: "general.navbar.register",
            variant: "secondary",
            path: "/register",
        },
        {
            key: "login",
            label: "general.navbar.login",
            variant: "primary",
            path: "/login",
        },
    ]

    return (
        <div
            className={`
                flex gap-3
                ${vertical ? "flex-col w-full" : "items-center"}
                ${className}
            `}
        >
            <div
                className={`
                    flex gap-2
                    ${vertical ? "flex-col w-full" : "items-center"}
                `}
            >
                {buttons.map(({ key, variant, label, path }) => (
                    <Button
                        key={key}
                        variant={variant}
                        onClick={() => navigate(path)}
                        className={vertical ? "w-full" : ""}
                    >
                        {t(label)}
                    </Button>
                ))}
            </div>

            <UserDropdown vertical={vertical} />
        </div>
    )
}

export default NavbarBtns
