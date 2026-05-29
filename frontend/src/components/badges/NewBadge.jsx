import React from "react"
import Badge from "./Badge"
import { IconSparkles2 } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"

const NewBadge = () => {
  const { t } = useLocale()
  return (
    <Badge variant="primary" svg={<IconSparkles2 />}>
      {t("ui.badges.new")}
    </Badge>
  )
}

export default NewBadge
