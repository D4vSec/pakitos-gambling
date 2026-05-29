import React from "react"
import Badge from "./Badge"
import { IconFlame } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"

const HotBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="primary" svg={<IconFlame />}>
      {t("ui.badges.hot")}
    </Badge>
  )
}

export default HotBadge
