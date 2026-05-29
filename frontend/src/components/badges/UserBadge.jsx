import React from "react"
import Badge from "./Badge"
import { useLocale } from "@/providers/LocaleProvider"
import { IconUser } from "@tabler/icons-react"

const UserBadge = () => {
  const { t } = useLocale()

  return (
    <Badge
      variant="ghost"
      svg={<IconUser />}
      className="bg-zinc-400 text-neutral">
      {t("ui.badges.user")}
    </Badge>
  )
}

export default UserBadge
