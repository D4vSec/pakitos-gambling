import React, { useEffect, useState } from "react"
import { useAdmin } from "@/providers/AdminProvider"
import Table from "./Table"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs().tz("Europe/Madrid").format("DD/MM/YYYY HH:mm:ss z")

const LogsTable = () => {
  const { getLogs } = useAdmin()
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
    { accessorKey: "action", header: "Action" },
    { accessorKey: "user_id", header: "User ID" },
    { accessorKey: "details", header: "Details", cell: (info) => JSON.stringify(info.getValue()) },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm:ss Z"),
    },
    ,
    { accessorKey: "ip_address", header: "IP Address" },
    {
      accessorKey: "user_agent",
      header: "User Agent",
      cell: (info) => JSON.stringify(JSON.parse(info.getValue())),
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
