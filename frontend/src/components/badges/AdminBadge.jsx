import React from "react"
import Badge from "./Badge"
import { useLocale } from "@/providers/LocaleProvider"
import UserKeySVG from "../svg/users/UserKeySVG"

const AdminBadge = () => {
  const { t } = useLocale()

  return (
    <Badge variant="info" svg={<UserKeySVG />}>
      {t("ui.badges.admin")}
    </Badge>
  )
}

export default AdminBadge
