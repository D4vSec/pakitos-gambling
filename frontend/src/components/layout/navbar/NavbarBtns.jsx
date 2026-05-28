import React from "react"
import NavigationBtn from "@/components/buttons/NavigationBtn"
import { useLocale } from "@/providers/LocaleProvider"
import { useSession } from "@/providers/SessionProvider"
import UserDropdown from "./UserDropdown"
import UserBalance from "./UserBalance"
import LangDropdown from "./LangDropdown"

const NavbarBtns = ({ className = "", vertical = false }) => {
  const { t } = useLocale()
  const { isLogged } = useSession()

  const buttons = [
    {
      key: "register",
      label: "navbar.register",
      variant: "secondary",
      path: "/register",
    },
    {
      key: "login",
      label: "navbar.login",
      variant: "primary",
      path: "/login",
    },
  ]

  return (
    <div
      className={`flex gap-3 ${vertical ? "flex-col w-full" : "items-center"} ${className}
            `}>
      <div
        className={`flex gap-2 ${vertical ? "flex-col w-full" : "items-center"}`}>
        {isLogged ? (
          <UserBalance />
        ) : (
          buttons.map(({ key, variant, label, path }) => (
            <NavigationBtn
              key={key}
              variant={variant}
              to={path}
              className={vertical ? "w-full" : ""}>
              {t(label)}
            </NavigationBtn>
          ))
        )}
      </div>

      <UserDropdown vertical={vertical} />
      <LangDropdown vertical={vertical} />
    </div>
  )
}

export default NavbarBtns
