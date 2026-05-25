import React from "react"
import { NavLink } from "react-router-dom"
import CoinsSVG from "@/components/svg/pictures/CoinsSVG"
import LogsSVG from "@/components/svg/pictures/LogsSVG"
import UsersSVG from "@/components/svg/users/UsersSVG"
import { useLocale } from "@/providers/LocaleProvider"

const sections = [
  {
    key: "users",
    label: "adminPanel.navigation.users",
    to: "/admin/users",
    Icon: UsersSVG,
  },
  {
    key: "bets",
    label: "adminPanel.navigation.bets",
    to: "/admin/bets",
    Icon: CoinsSVG,
  },
  {
    key: "logs",
    label: "adminPanel.navigation.logs",
    to: "/admin/logs",
    Icon: LogsSVG,
  },
]

const AdminSectionNav = () => {
  const { t } = useLocale()

  return (
    <nav className="mx-auto grid w-full max-w-5xl grid-cols-3 gap-1 rounded-2xl border border-neutral/70 bg-neutral p-1.5 shadow-lg">
      {sections.map(({ key, label, to, Icon }) => (
        <NavLink
          key={key}
          to={to}
          className={({ isActive }) =>
            `flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-content shadow-md"
                : "bg-transparent text-base-content/75 hover:bg-base-100/8 hover:text-base-content"
            }`
          }>
          <span className="inline-flex opacity-85">
            <Icon />
          </span>
          <span className="truncate text-center">{t(label)}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default AdminSectionNav
