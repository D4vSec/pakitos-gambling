import React from "react"
import AdminBadge from "../badges/AdminBadge"
import UserBadge from "../badges/UserBadge"
import UnknownBadge from "../badges/UnknownBadge"

const BadgesSelector = ({ role }) => {
  return role === "admin" ? (
    <AdminBadge />
  ) : role === "user" ? (
    <UserBadge />
  ) : (
    <UnknownBadge />
  )
}

export default BadgesSelector
