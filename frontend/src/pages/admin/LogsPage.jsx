import React from "react"
import AdminPageHeader from "@/components/admin/components/AdminPageHeader"
import LogsTable from "@/components/admin/tables/LogsTable"
import GradientBg from "@/components/layout/GradientBg"
import { useLocale } from "@/providers/LocaleProvider"

const LogsPage = () => {
  const { t } = useLocale()

  return (
    <GradientBg>
      <div className="flex flex-col gap-4">
        <AdminPageHeader title={t("adminPanel.logs.title")} backLink="/home" />
        <LogsTable />
      </div>
    </GradientBg>
  )
}

export default LogsPage
