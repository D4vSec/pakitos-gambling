import React, { useMemo } from "react"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import useTable from "@/hooks/useTable"
import Table from "./Table"
import UserActions from "../renderers/UserActions"
import BitcoinSVG from "@/components/svg/pictures/BitcoinSVG"
import RoleBadgeSelector from "../badges/RoleBadgeSelector"
import UsersFilterBar from "../filters/UsersFilterBar"

const UsersTable = () => {
  const { getAllUsers } = useAdmin()
  const { t } = useLocale()

  const initialFilters = useMemo(
    () => ({
      username: "",
      email: "",
      role: "",
      minBalance: "",
      maxBalance: "",
      balance: "",
      filterField: "",
      filterValue: "",
      filters: [],
    }),
    [],
  )

  const initialSorting = useMemo(() => [{ id: "username", desc: false }], [])

  const {
    data,
    pagination,
    setPagination,
    sorting,
    setSorting,
    filters,
    handleFilterChange,
  } = useTable(getAllUsers, initialFilters, initialSorting)

  const columns = useMemo(
    () => [
      {
        accessorKey: "username",
        header: t("adminPanel.users.table.username"),
      },
      {
        accessorKey: "email",
        header: t("adminPanel.users.table.email"),
      },
      {
        accessorKey: "role",
        header: t("adminPanel.users.table.role"),
        cell: (info) => <RoleBadgeSelector role={info.getValue()} />,
      },
      {
        accessorKey: "balance",
        header: t("adminPanel.users.table.balance"),
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
    ],
    [t],
  )

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <UsersFilterBar filters={filters} onChange={handleFilterChange} />
      <Table
        data={data?.users || []}
        columns={columns}
        pageCount={data?.totalPages || 0}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  )
}

export default UsersTable
