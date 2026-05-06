import React, { useState, useEffect } from "react"
import Table from "./Table"
import { useParams } from "react-router-dom"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import BitcoinSVG from "@/components/svg/pictures/BitcoinSVG"
import { fullDateFormatter } from "@/utils/adminUtils"
import TransactionBadgeSelector from "../badges/TransactionBadgeSelector"

const UserTransactions = () => {
  const { getTransactionsById } = useAdmin()
  const { id } = useParams()
  const { t } = useLocale()

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
    {
      accessorKey: "type",
      header: t("adminPanel.userDetails.transactions.table.type"),
      cell: (info) => <TransactionBadgeSelector type={info.getValue()} />,
    },
    {
      accessorKey: "amount",
      header: t("adminPanel.userDetails.transactions.table.amount"),
      sortingFn: "alphanumeric",
      cell: (info) => (
        <div className="flex items-center gap-1">
          {info.getValue()} <BitcoinSVG />
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: t("adminPanel.userDetails.transactions.table.date"),
      cell: (info) => fullDateFormatter(info.getValue()),
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
