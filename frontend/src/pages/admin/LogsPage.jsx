import React from "react"
import AdminPageHeader from "@/components/admin/components/AdminPageHeader"
import LogsTable from "@/components/admin/tables/LogsTable"
import { useLocale } from "@/providers/LocaleProvider"

const LogsPage = () => {
  const { t } = useLocale()

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <AdminPageHeader title={t("adminPanel.logs.title")} backLink="/home" />
      <LogsTable />
    </div>
  )
}

export default LogsPage
