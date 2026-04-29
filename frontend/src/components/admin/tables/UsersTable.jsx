import React from "react"
import Table from "./Table"
import UserActions from "../UserActions"

const UsersTable = ({ users }) => {
  const columns = [
    { accessorKey: "username", header: "Username" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "balance", header: "Balance" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <UserActions id={row.original.id} />,
    },
  ]

  return <Table data={users} columns={columns} />
}

export default UsersTable
