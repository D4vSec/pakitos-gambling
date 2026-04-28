import React, { useEffect } from "react"
import GradientBg from "@/components/layout/GradientBg"
import Title from "@/components/Title"
import { useAdmin } from "@/providers/AdminProvider"
import UserTable from "@/components/admin/UserTable"
import Button from "@/components/buttons/Button"
import UserPlusSVG from "@/components/svg/UserPlusSVG"
import { useNavigate } from "react-router-dom"

const AllUsers = () => {
  const { getAllUsers, users } = useAdmin()

  const navigate = useNavigate()

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <GradientBg>
      <Title>All Users</Title>
      <UserTable users={users} />
      <Button
        svg={<UserPlusSVG />}
        variant="success"
        onClick={() => navigate("/admin/users/create")}>
        Create New User
      </Button>
    </GradientBg>
  )
}

export default AllUsers
