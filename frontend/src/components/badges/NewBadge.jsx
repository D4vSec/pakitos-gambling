import React from "react"
import Badge from "./Badge"
import SparkleSVG from "../svg/pictures/SparkleSVG"
import { useLocale } from "@/providers/LocaleProvider"

const NewBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="primary" svg={<SparkleSVG />}>
      {t("ui.badges.new")}
    </Badge>
  )
}

export default NewBadge
