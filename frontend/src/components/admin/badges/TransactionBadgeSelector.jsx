import React from "react"
import Badge from "@/components/badges/Badge"

const TransactionBadgeSelector = ({ type }) => {
  const types = {
    DEPOSIT: "bg-green-700 text-white",
    WITHDRAWAL: "bg-red-500 text-white",
    BET: "bg-amber-500 text-black",
    WIN: "bg-emerald-500 text-white",
    LOSE: "bg-rose-600 text-white",
    BONUS: "bg-purple-500 text-white",
    REFUND: "bg-cyan-500 text-black",
  }

  return (
    <Badge variant="ghost" className={`${types[type]} whitespace-nowrap`}>
      {type.split("_").join(" ")}
    </Badge>
  )
}

export default TransactionBadgeSelector
