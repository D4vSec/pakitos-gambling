import React, { useState, useEffect } from "react"
import { useAdmin } from "@/providers/AdminProvider"
import Table from "./Table"
import UserActions from "../UserActions"
import BitcoinSVG from "@/components/svg/BitcoinSVG"

const UsersTable = () => {
  const { getAllUsers, users } = useAdmin()
  const [usersData, setUsersData] = useState(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchUsers = async () => {
    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }
    const res = await getAllUsers(params)
    setUsersData(res)
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.pageIndex, pagination.pageSize])

  const columns = [
    { accessorKey: "username", header: "Username" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "balance",
      header: "Balance",
      sortingFn: "alphanumeric",
      cell: (info) => (
        <div className="flex items-center gap-1">
          {info.getValue()} <BitcoinSVG />
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <UserActions id={row.original.id} />,
    },
  ]

  return (
    pagination && (
      <Table
        data={users?.users || []}
        columns={columns}
        pageCount={usersData?.totalPages || 0}
        pagination={pagination}
        setPagination={setPagination}
      />
    )
  )
}

export default UsersTable
