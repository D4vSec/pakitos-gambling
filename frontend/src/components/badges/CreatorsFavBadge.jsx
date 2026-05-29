import React from "react"
import { IconStar } from "@tabler/icons-react"
import Badge from "./Badge"
import { useLocale } from "@/providers/LocaleProvider"

const CreatorsFavBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="warning" svg={<IconStar />}>
      {t("ui.badges.creatorsFav")}
    </Badge>
  )
}

export default CreatorsFavBadge
