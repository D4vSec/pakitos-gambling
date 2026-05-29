import React from "react"
import Badge from "./Badge"
import { IconCrown } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"

const PopularBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="secondary" svg={<IconCrown />}>
      {t("ui.badges.popular")}
    </Badge>
  )
}

export default PopularBadge
