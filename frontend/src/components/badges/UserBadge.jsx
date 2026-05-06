import React from "react"
import Badge from "./Badge"
import { useLocale } from "@/providers/LocaleProvider"
import UserSVG from "../svg/users/UserSVG"

const UserBadge = () => {
  const { t } = useLocale()

  return (
    <Badge variant="info" svg={<UserSVG />}>
      {t("ui.badges.user")}
    </Badge>
  )
}

export default UserBadge
