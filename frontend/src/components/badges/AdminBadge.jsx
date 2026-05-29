import React from "react"
import Badge from "./Badge"
import { useLocale } from "@/providers/LocaleProvider"
import { IconUserKey } from "@tabler/icons-react"

const AdminBadge = () => {
  const { t } = useLocale()

  return (
    <Badge variant="info" svg={<IconUserKey />}>
      {t("ui.badges.admin")}
    </Badge>
  )
}

export default AdminBadge
