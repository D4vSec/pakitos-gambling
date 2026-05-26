import React from "react"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import Title from "@/components/layout/fonts/Title"
import AdminSectionNav from "./AdminSectionNav"

const AdminPageHeader = ({ title, backLink = "/home", actions }) => {
  const hasActions = React.Children.count(actions) > 0

  return (
    <div className="flex flex-col gap-4">
      <AdminSectionNav />
      <Title>{title}</Title>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <GoBackBtn link={backLink} />
        {hasActions ? (
          <div className="flex flex-wrap justify-end gap-2">{actions}</div>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default AdminPageHeader
