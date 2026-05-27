import React, { useEffect, useState, useMemo } from "react"
import useTable from "@/hooks/useTable"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Table from "./Table"
import { fullDateFormatter, buildUserAgent } from "@/utils/adminUtils"
import TruncateId from "../renderers/TruncateId"
import ActionDetails from "../renderers/ActionDetails"
import AuditBadgeSelector from "../badges/AuditBadgeSelector"
import LogsFilterBar from "../filters/LogsFilterBar"

const LogsTable = () => {
  const { getLogs } = useAdmin()
  const { t } = useLocale()

  const initialFilters = useMemo(
    () => ({
      action: "",
      userId: "",
      details: "",
      fromDate: "",
      toDate: "",
      ipAddress: "",
      userAgent: "",
      columns: "",
      filterField: "",
      filterValue: "",
      filters: [],
    }),
    [],
  )

  const initialSorting = useMemo(() => [{ id: "created_at", desc: true }], [])

  const {
    data,
    pagination,
    setPagination,
    sorting,
    setSorting,
    filters,
    handleFilterChange,
  } = useTable(getLogs, initialFilters, initialSorting)

  const columns = useMemo(
    () => [
      {
        accessorKey: "action",
        header: t("adminPanel.logs.table.action"),
        cell: (info) => <AuditBadgeSelector type={info.getValue()} />,
      },
      {
        accessorKey: "user_id",
        header: t("adminPanel.logs.table.user_id"),
        cell: (info) => <TruncateId id={info.getValue()} />,
      },
      {
        accessorKey: "details",
        header: t("adminPanel.logs.table.details"),
        cell: (info) => <ActionDetails value={info.getValue()} />,
        enableSorting: false,
      },
      {
        accessorKey: "created_at",
        header: t("adminPanel.logs.table.created_at"),
        cell: (info) => fullDateFormatter(info.getValue()),
      },
      {
        accessorKey: "ip_address",
        header: t("adminPanel.logs.table.ip_address"),
      },
      {
        accessorKey: "user_agent",
        header: t("adminPanel.logs.table.user_agent"),
        cell: (info) => buildUserAgent(info.getValue()),
      },
    ],
    [t],
  )

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <LogsFilterBar filters={filters} onChange={handleFilterChange} />
      <Table
        data={data?.logs || []}
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

export default LogsTable
