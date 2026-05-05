import React from "react"
import Badge from "./Badge"
import CrownSVG from "../svg/pictures/CrownSVG"
import { useLocale } from "@/providers/LocaleProvider"

const PopularBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="secondary" svg={<CrownSVG />}>
      {t("ui.badges.popular")}
    </Badge>
  )
}

export default PopularBadge
