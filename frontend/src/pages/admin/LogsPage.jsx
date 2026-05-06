import React from "react"
import Title from "@/components/layout/fonts/Title"
import GradientBg from "@/components/layout/GradientBg"
import LogsTable from "@/components/admin/tables/LogsTable"
import GoBackBtn from "@/components/buttons/GoBackBtn"

const LogsPage = () => {
  return (
    <GradientBg>
      <div>
        <div className="grid grid-cols-3 items-center w-full py-4">
          <div className="justify-self-start pt-4">
            <GoBackBtn link="/admin/users" />
          </div>
          <div className="text-center">
            <Title>Logs</Title>
          </div>
          <div className="hidden md:block"></div>
        </div>
        <LogsTable />
      </div>
    </GradientBg>
  )
}

export default LogsPage
