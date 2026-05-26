import React from "react"
import Badge from "@/components/badges/Badge"
import { useLocale } from "@/providers/LocaleProvider"
import { getBetStatusVariant } from "@/utils/betsUtils"

const BetStatusBadge = ({ status }) => {
  const { t } = useLocale()

  return (
    <Badge variant={getBetStatusVariant(status)} size="sm">
      {t(`pages.bets.status.${status}`)}
    </Badge>
  )
}

export default BetStatusBadge
