import React from "react"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import Title from "@/components/layout/fonts/Title"

const AdminPageHeader = ({ title, backLink = "/home", actions }) => {
  const hasActions = React.Children.count(actions) > 0

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <Title>{title}</Title>

      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
        <GoBackBtn link={backLink} />
        {hasActions ? (
          <div className="flex min-w-0 flex-wrap justify-end gap-2">{actions}</div>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default AdminPageHeader
