import React from "react"
import Badge from "./Badge"
import { useLocale } from "@/providers/LocaleProvider"
import UserSVG from "../svg/users/UserSVG"

const UserBadge = () => {
  const { t } = useLocale()

  return (
    <Badge
      variant="ghost"
      svg={<UserSVG />}
      className="bg-zinc-400 text-neutral">
      {t("ui.badges.user")}
    </Badge>
  )
}

export default UserBadge
