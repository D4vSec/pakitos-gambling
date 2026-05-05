import React from "react"
import Badge from "./Badge"
import DolarSVG from "../svg/DolarSVG"

const PayoutBadge = ({ text }) => {
  return (
    <Badge variant="success" svg={<DolarSVG />}>
      {text}
    </Badge>
  )
}

export default PayoutBadge
