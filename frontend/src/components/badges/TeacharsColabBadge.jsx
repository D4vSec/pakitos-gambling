import React from "react"
import Badge from "./Badge"
import UsersSVG from "../svg/UsersSVG"
import { useLocale } from "@/providers/LocaleProvider"

const TeachersColabBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="info" svg={<UsersSVG />}>
      {t("ui.badges.teachers")}
    </Badge>
  )
}

export default TeachersColabBadge
