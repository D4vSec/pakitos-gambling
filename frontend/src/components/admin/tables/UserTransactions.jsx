import React, { useState, useEffect } from "react"
import Table from "./Table"
import { useParams } from "react-router-dom"
import { useAdmin } from "@/providers/AdminProvider"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import BitcoinSVG from "@/components/svg/BitcoinSVG"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs().tz("Europe/Madrid").format("DD/MM/YYYY HH:mm:ss z")

const UserTransactions = () => {
  const { getTransactionsById } = useAdmin()
  const { id } = useParams()
  const [transactionsData, setTransactionsData] = useState(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchTransactions = async () => {
    if (!id) return
    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }
    const res = await getTransactionsById(id, params)
    setTransactionsData(res)
  }

  useEffect(() => {
    fetchTransactions()
  }, [id, pagination.pageIndex, pagination.pageSize])

  const columns = [
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "amount",
      header: "Amount",
      sortingFn: "alphanumeric",
      cell: (info) => (
        <div className="flex items-center gap-1">
          {info.getValue()} <BitcoinSVG />
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm:ss Z"),
    },
  ]

  return (
    pagination && (
      <Table
        data={transactionsData?.transactions || []}
        columns={columns}
        pageCount={transactionsData?.totalPages || 0}
        pagination={pagination}
        setPagination={setPagination}
      />
    )
  )
}
export default UserTransactions
