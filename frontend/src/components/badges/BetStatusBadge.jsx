import React from "react"
import Badge from "@/components/badges/Badge"
import { useLocale } from "@/providers/LocaleProvider"
import { getBetStatusVariant } from "@/utils/betsUtils"

const BetStatusBadge = ({ status }) => {
  const { t } = useLocale()

  return (
    <Badge
      variant={getBetStatusVariant(status)}
      size="sm"
      className="px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
      {t(`pages.bets.status.${status}`)}
    </Badge>
  )
}

export default BetStatusBadge
