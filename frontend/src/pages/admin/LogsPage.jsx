import React, { useEffect } from "react"
import Title from "@/components/layout/fonts/Title"
import GradientBg from "@/components/layout/GradientBg"
import LogsTable from "@/components/admin/tables/LogsTable"

const LogsPage = () => {
  return (
    <GradientBg>
      <Title>Logs</Title>
      <LogsTable />
    </GradientBg>
  )
}

export default LogsPage
