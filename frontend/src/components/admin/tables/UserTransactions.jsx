import React, { useMemo, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import useTable from "@/hooks/useTable"
import Table from "./Table"
import BitcoinSVG from "@/components/svg/pictures/BitcoinSVG"
import { fullDateFormatter } from "@/utils/adminUtils"
import TransactionBadgeSelector from "../badges/TransactionBadgeSelector"
import TransactionsFilterBar from "../filters/TransactionsFilterBar"

const UserTransactions = () => {
  const { getTransactionsById } = useAdmin()
  const { id: userId } = useParams()
  const { t } = useLocale()

  const isValidUUID = (id) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }

  const fetchWithId = useCallback(
    async (params) => {
      if (!userId || !isValidUUID(userId)) {
        console.warn("ID de usuario no válido, abortando petición")
        return { transactions: [], totalPages: 0 }
      }

      return getTransactionsById(userId, params)
    },
    [getTransactionsById, userId],
  )

  const initialFilters = useMemo(
    () => ({
      type: "",
      amount: "",
      minAmount: "",
      maxAmount: "",
      fromDate: "",
      toDate: "",
      filters: [],
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
  } = useTable(fetchWithId, initialFilters, initialSorting)

  const columns = useMemo(
    () => [
      {
        accessorKey: "type",
        header: t("adminPanel.userDetails.transactions.table.type"),
        cell: (info) => <TransactionBadgeSelector type={info.getValue()} />,
      },
      {
        accessorKey: "amount",
        header: t("adminPanel.userDetails.transactions.table.amount"),
        cell: (info) => (
          <div className="flex items-center gap-1 ">
            {info.getValue()} <BitcoinSVG />
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: t("adminPanel.userDetails.transactions.table.date"),
        cell: (info) => fullDateFormatter(info.getValue()),
      },
    ],
    [t],
  )

  return (
    <div className="flex flex-col gap-4">
      <TransactionsFilterBar filters={filters} onChange={handleFilterChange} />
      <Table
        data={data?.transactions || []}
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

export default UserTransactions
