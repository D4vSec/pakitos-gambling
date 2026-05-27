import React, { useMemo } from "react"
import BetStatusBadge from "@/components/badges/BetStatusBadge"
import useTable from "@/hooks/useTable"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import { fullDateFormatter } from "@/utils/adminUtils"
import AdminBetsFilterBar from "../filters/AdminBetsFilterBar"
import BetActions from "../renderers/BetActions"
import Table from "./Table"

const BetsTable = () => {
  const { getAdminBets } = useAdmin()
  const { t } = useLocale()

  const initialFilters = useMemo(
    () => ({
      filters: [],
      fromEndsAt: "",
      toEndsAt: "",
      fromCreatedAt: "",
      toCreatedAt: "",
    }),
    [],
  )
  const initialSorting = useMemo(() => [{ id: "created_at", desc: true }], [])

  const {
    data,
    isLoading,
    pagination,
    setPagination,
    sorting,
    setSorting,
    filters,
    handleFilterChange,
    refresh,
  } = useTable(getAdminBets, initialFilters, initialSorting)

  const columns = useMemo(
    () => [
      {
        accessorKey: "label",
        header: t("adminPanel.bets.table.label"),
      },
      {
        accessorKey: "status",
        header: t("adminPanel.bets.table.status"),
        cell: (info) => <BetStatusBadge status={info.getValue()} />,
      },
      {
        accessorKey: "ends_at",
        header: t("adminPanel.bets.table.ends_at"),
        cell: (info) => fullDateFormatter(info.getValue()),
      },
      {
        accessorKey: "created_at",
        header: t("adminPanel.bets.table.created_at"),
        cell: (info) => fullDateFormatter(info.getValue()),
      },
      {
        id: "optionsCount",
        accessorFn: (row) => row.options?.length || 0,
        header: t("adminPanel.bets.table.options"),
        cell: (info) => info.getValue(),
      },
      {
        id: "actions",
        header: t("adminPanel.bets.table.actions"),
        cell: ({ row }) => (
          <BetActions
            id={row.original.id}
            label={row.original.label}
            status={row.original.status}
            onRefresh={refresh}
          />
        ),
        enableSorting: false,
      },
    ],
    [refresh, t],
  )

  return (
    <div className="flex flex-col gap-4">
      <AdminBetsFilterBar filters={filters} onChange={handleFilterChange} />
      <Table
        data={data?.bets || []}
        columns={columns}
        pageCount={data?.totalPages || 0}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  )
}

export default BetsTable
