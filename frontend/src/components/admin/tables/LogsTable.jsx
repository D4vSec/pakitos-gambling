import React, { useEffect, useState, useCallback } from "react"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Table from "./Table"
import { fullDateFormatter, buildUserAgent } from "@/utils/adminUtils"
import TruncateId from "../renderers/TruncateId"
import ActionDetails from "../renderers/ActionDetails"
import AuditBadgeSelector from "../badges/AuditBadgeSelector"
import FilterBar from "./FilterBar"

const LogsTable = () => {
  const { getLogs } = useAdmin()
  const { t } = useLocale()
  const [logsData, setLogsData] = useState(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [filters, setFilters] = useState({
    action: "",
    fromDate: "",
    toDate: "",
    result: "",
    userId: "",
  })

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  useEffect(() => {
    const loadData = async () => {
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...filters,
      }
      const res = await getLogs(params)
      if (filters.action === "GAME_RESULT" && filters.result) {
        const filteredLogs = res.logs.filter((log) => {
          if (log.action !== "GAME_RESULT") return true
          const payout = log.details?.payout || 0
          if (filters.result === "win") {
            return payout > 0
          } else if (filters.result === "lose") {
            return payout === 0
          }
          return true
        })
        setLogsData({
          ...res,
          logs: filteredLogs,
        })
      } else {
        setLogsData(res)
      }
    }
    loadData()
  }, [pagination.pageIndex, pagination.pageSize, filters])

  const columns = [
    {
      accessorKey: "action",
      header: t("adminPanel.logs.table.action"),
      cell: (info) => <AuditBadgeSelector type={info.getValue()} />,
    },
    {
      accessorKey: "user_id",
      header: t("adminPanel.logs.table.userID"),
      cell: (info) => <TruncateId id={info.getValue()} />,
    },
    {
      accessorKey: "details",
      header: t("adminPanel.logs.table.details"),
      cell: (info) => <ActionDetails value={info.getValue()} />,
    },
    {
      accessorKey: "created_at",
      header: t("adminPanel.logs.table.date"),
      cell: (info) => fullDateFormatter(info.getValue()),
    },
    ,
    { accessorKey: "ip_address", header: t("adminPanel.logs.table.ipAddress") },
    {
      accessorKey: "user_agent",
      header: t("adminPanel.logs.table.userAgent"),
      cell: (info) => buildUserAgent(info.getValue()),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <FilterBar filters={filters} onChange={handleFilterChange} />
      {pagination && (
        <Table
          data={logsData?.logs || []}
          columns={columns}
          pageCount={logsData?.totalPages || 0}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </div>
  )
}

export default LogsTable
