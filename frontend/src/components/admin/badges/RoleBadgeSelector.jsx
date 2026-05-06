import React from "react"
import AdminBadge from "../../badges/AdminBadge"
import UserBadge from "../../badges/UserBadge"
import UnknownBadge from "../../badges/UnknownBadge"

const RoleBadgeSelector = ({ role }) => {
  const types = {
    admin: <AdminBadge />,
    user: <UserBadge />,
  }

  return types[role] || <UnknownBadge />
}

export default RoleBadgeSelector
