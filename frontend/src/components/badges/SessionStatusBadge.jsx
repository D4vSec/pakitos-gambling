import React from "react"
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react"
import Badge from "./Badge"
import { useLocale } from "@/providers/LocaleProvider"

const variantByStatus = {
  active: "success",
  expired: "warning",
  revoked: "error",
}

const SessionStatusBadge = ({ status }) => {
  const { t } = useLocale()
  const safeStatus = variantByStatus[status] ? status : "active"
  const variant = variantByStatus[safeStatus]
  const icon =
    safeStatus === "active" ? (
      <IconCircleCheck className="h-4 w-4" />
    ) : (
      <IconCircleX className="h-4 w-4" />
    )

  return (
    <Badge variant={variant} size="sm" className="whitespace-nowrap" svg={icon}>
      {t(`adminPanel.userDetails.sessions.status.${safeStatus}`)}
    </Badge>
  )
}

export default SessionStatusBadge
