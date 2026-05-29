import React from "react"
import Badge from "./Badge"
import { IconCurrencyDollar } from "@tabler/icons-react"

const PayoutBadge = ({ text }) => {
  return (
    <Badge variant="success" svg={<IconCurrencyDollar />}>
      {text}
    </Badge>
  )
}

export default PayoutBadge
