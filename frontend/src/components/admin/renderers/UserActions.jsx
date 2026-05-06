import React from "react"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import EditSVG from "../../svg/actions/EditSVG"
import Button from "../../buttons/Button"
import TrashXSVG from "../../svg/actions/TrashXSVG"
import InfoSVG from "../../svg/actions/InfoSVG"

const UserActions = ({ id }) => {
  const navigate = useNavigate()
  const { deleteModal } = useAdmin()
  const { t } = useLocale()

  const buttons = [
    {
      label: "ui.buttons.info",
      svg: <InfoSVG />,
      variant: "info",
      onClick: () => navigate(`/admin/users/${id}`),
      tooltip: "tooltip-info",
    },
    {
      label: "ui.buttons.edit",
      svg: <EditSVG />,
      variant: "warning",
      onClick: () => navigate(`/admin/users/edit/${id}`),
      tooltip: "tooltip-warning",
    },
    {
      label: "ui.buttons.delete",
      svg: <TrashXSVG />,
      variant: "error",
      onClick: () => deleteModal(id),
      tooltip: "tooltip-error",
    },
  ]
  return (
    <div className="flex gap-2">
      {buttons.map((button, index) => (
        <div
          key={index}
          className={`tooltip tooltip-top cursor-pointer ${button.tooltip}`}
          data-tip={t(button.label)}>
          <Button
            variant={button.variant}
            size={"sm"}
            svg={button.svg}
            onClick={button.onClick}></Button>
        </div>
      ))}
    </div>
  )
}

export default UserActions
