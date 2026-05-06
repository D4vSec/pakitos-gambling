import React from "react"
import Badge from "@/components/badges/Badge"

const AuditBadgeSelector = ({ type }) => {
  const types = {
    USER_REGISTER: "bg-green-500 text-white",
    BET_PLACED: "bg-amber-500 text-black",
    BET_RESULT: "bg-blue-500 text-white",
    BALANCE_UPDATED: "bg-cyan-500 text-black",
    ADMIN_ACTION: "bg-red-500 text-white",
    GAME_RESULT: "bg-purple-700 text-white",
  }

  return (
    <Badge variant="ghost" className={`${types[type]} whitespace-nowrap`}>
      {type.split("_").join(" ")}
    </Badge>
  )
}

export default AuditBadgeSelector
