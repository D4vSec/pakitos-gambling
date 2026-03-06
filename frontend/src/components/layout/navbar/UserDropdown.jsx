import React from "react"
import UserSVG from "@/components/svg/UserSVG"
import { useLocale } from "@/providers/LocaleProvider"
import { useSession } from "@/providers/SessionProvider"

const UserDropdown = ({ vertical = false }) => {
    const { t } = useLocale()
    const { logout, user } = useSession()

    const userDropdownLinks = [
        { key: "settings", label: "general.navbar.userPill.settings" },
        { key: "coupon", label: "general.navbar.userPill.coupon" },
        {
            key: "logout",
            label: "general.navbar.userPill.logout",
            className: "text-error",
            onClick: () => logout(),
        },
    ]

    return (
        <div className={`dropdown ${vertical ? "dropdown-open w-full" : "dropdown-end"}`}>
            <div
                tabIndex={0}
                role="button"
                className={`flex gap-2 items-center btn rounded-selector ${
                    vertical ? "w-full justify-center" : "hover:bg-base-300"
                }`}
            >
                <UserSVG />
                <p>{user?.username || t("general.navbar.userPill.guest")}</p>
            </div>

            <ul
                tabIndex={0}
                className={`dropdown-content menu bg-base-100 rounded-box mt-2 p-2 shadow ${
                    vertical ? "w-full z-1" : "w-52 z-10"
                }`}
            >
                {userDropdownLinks.map(({ key, label, className, onClick }) => (
                    <li key={key}>
                        <a className={className || ""} onClick={onClick}>
                            {t(label)}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserDropdown
