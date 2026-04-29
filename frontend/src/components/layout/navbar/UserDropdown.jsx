import React from "react"
import { Link } from "react-router-dom"
import UserSVG from "@/components/svg/UserSVG"
import { useLocale } from "@/providers/LocaleProvider"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"

const UserDropdown = ({ vertical = false }) => {
  const { t } = useLocale()
  const { logout, user } = useSession()
  const { addNotification } = useNotification()

  const noUser = Object.keys(user).length === 0

  const userDropdownLinks = [
    {
      key: "settings",
      label: "general.navbar.userPill.settings",
      href: "/settings",
    },
    {
      key: "balance",
      label: "general.navbar.userPill.balance",
      href: "/addBalance",
    },
    { key: "coupon", label: "general.navbar.userPill.coupon", href: "" },
    // TODO: Esconderlo sin el hidden
    {
      key: "adminPanel",
      label: "general.navbar.userPill.adminPanel",
      href: "/admin/users",
      className: `${user.role !== "admin" && "hidden"} text-warning`,
    },
    {
      key: "logout",
      label: "general.navbar.userPill.logout",
      className: "text-error",
      onClick: () =>
        addNotification(t("message.modal.logout.title"), "modal", {
          onAccept: () => logout(),
          acceptLabel: t("message.modal.logout.accept"),
          cancelLabel: t("message.modal.logout.cancel"),
        }),
    },
  ]

  return (
    <div
      className={`dropdown ${vertical ? "w-full" : "dropdown-end"} ${noUser && "dropdown-close pointer-events-none"}`}>
      <div
        tabIndex={0}
        role="button"
        className={`flex gap-2 items-center btn rounded-selector ${
          vertical ? "w-full justify-center" : "hover:bg-base-300"
        }`}>
        <UserSVG />
        <p>{user?.username || t("general.navbar.userPill.guest")}</p>
      </div>
      {vertical && !noUser ? (
        <ul className="menu bg-base-100 rounded-box w-full mt-2 p-2">
          {userDropdownLinks.map(({ key, label, className, href, onClick }) => (
            <li key={key} className={className} onClick={onClick}>
              <Link to={href}>{t(label)}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box mt-2 p-2 shadow w-52 z-10">
          {userDropdownLinks.map(({ key, label, className, href, onClick }) => (
            <li key={key} className={className} onClick={onClick}>
              <Link to={href}>{t(label)}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserDropdown
