import React, { useEffect, useState } from "react"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Table from "./Table"
import { fullDateFormatter, buildUserAgent } from "@/utils/adminUtils"
import TruncateId from "../TruncateId"

const LogsTable = () => {
  const { getLogs } = useAdmin()
  const { t } = useLocale()
  const [logsData, setLogsData] = useState(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchLogs = async () => {
    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }
    const res = await getLogs(params)
    setLogsData(res)
  }

  const columns = [
    { accessorKey: "action", header: t("adminPanel.logs.table.action") },
    {
      accessorKey: "user_id",
      header: t("adminPanel.logs.table.userID"),
      cell: (info) => <TruncateId id={info.getValue()} />,
    },
    {
      accessorKey: "details",
      header: t("adminPanel.logs.table.details"),
      cell: (info) => JSON.stringify(info.getValue()),
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

  useEffect(() => {
    fetchLogs()
  }, [pagination.pageIndex, pagination.pageSize])

  return (
    pagination && (
      <Table
        data={logsData?.logs || []}
        columns={columns}
        pageCount={logsData?.totalPages || 0}
        pagination={pagination}
        setPagination={setPagination}
      />
    )
  )
}

export default LogsTable
