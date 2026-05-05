import React from "react"
import Badge from "./Badge"
import FlameSVG from "../svg/FlameSVG"
import { useLocale } from "@/providers/LocaleProvider"

const HotBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="primary" svg={<FlameSVG />}>
      {t("ui.badges.hot")}
    </Badge>
  )
}

export default HotBadge
