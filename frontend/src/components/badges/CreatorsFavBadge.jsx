import React from "react"
import StarSVG from "../svg/pictures/StarSVG"
import Badge from "./Badge"
import { useLocale } from "@/providers/LocaleProvider"

const CreatorsFavBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="warning" svg={<StarSVG />}>
      {t("ui.badges.creatorsFav")}
    </Badge>
  )
}

export default CreatorsFavBadge
