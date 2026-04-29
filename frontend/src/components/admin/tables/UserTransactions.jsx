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
  const [transactions, setTransactions] = useState(null)
  const { getTransactionsById } = useAdmin()
  const { id } = useParams()

  const page = transactions?.page || 1
  const limit = transactions?.limit || 5
  const totalPages = transactions?.totalPages || 1

  const fetchData = async (p = page, l = limit) => {
    const res = await getTransactionsById(id, { page: p, limit: l })
    setTransactions(res)
  }

  useEffect(() => {
    if (!id) return
    fetchData()
  }, [id, page, limit])

  const columns = [
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => (
        <div className="flex gap-1 items-center">
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
    <Table
      data={transactions?.transactions || []}
      columns={columns}
      paginationEvents={{
        page,
        totalPages,
        limit,
        setPage: (p) => fetchData(p, limit),
        setLimit: (l) => fetchData(1, l),
      }}
    />
  )
}

export default UserTransactions
