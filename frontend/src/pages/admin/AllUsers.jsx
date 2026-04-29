import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "@/providers/AdminProvider"
import Title from "@/components/Title"
import GradientBg from "@/components/layout/GradientBg"
import Button from "@/components/buttons/Button"
import UserPlusSVG from "@/components/svg/UserPlusSVG"
import UsersTable from "@/components/admin/tables/UsersTable"

const AllUsers = () => {
  const { getAllUsers, users } = useAdmin()

  const navigate = useNavigate()

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <GradientBg>
      <Title>All Users</Title>
      <UsersTable users={users.users} />
      <Button
        svg={<UserPlusSVG />}
        variant="success"
        onClick={() => navigate("/admin/users/create")}
      >
        Create New User
      </Button>
    </GradientBg>
  )
}

export default AllUsers
