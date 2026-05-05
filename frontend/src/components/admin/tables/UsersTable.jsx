import React, { useState, useEffect } from "react"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Table from "./Table"
import UserActions from "../UserActions"
import BitcoinSVG from "@/components/svg/pictures/BitcoinSVG"
import BadgesSelector from "../BadgesSelector"

const UsersTable = () => {
  const { getAllUsers, users } = useAdmin()
  const { t } = useLocale()
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

  const columns = [
    {
      accessorKey: "username",
      header: t("adminPanel.users.table.username"),
    },
    { accessorKey: "email", header: t("adminPanel.users.table.email") },
    {
      accessorKey: "role",
      header: t("adminPanel.users.table.role"),
      cell: (info) => <BadgesSelector role={info.getValue()} />,
    },
    {
      accessorKey: "balance",
      header: t("adminPanel.users.table.balance"),
      sortingFn: "alphanumeric",
      cell: (info) => (
        <div className="flex items-center gap-1">
          {info.getValue()} <BitcoinSVG />
        </div>
      ),
    },
    {
      id: "actions",
      header: t("adminPanel.users.table.actions"),
      cell: ({ row }) => <UserActions id={row.original.id} />,
    },
  ]

  useEffect(() => {
    fetchUsers()
  }, [pagination.pageIndex, pagination.pageSize])

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
