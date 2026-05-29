import React from "react"
import Badge from "./Badge"
import { IconUsers } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"

const TeachersColabBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="info" svg={<IconUsers />}>
      {t("ui.badges.teachers")}
    </Badge>
  )
}

export default TeachersColabBadge
