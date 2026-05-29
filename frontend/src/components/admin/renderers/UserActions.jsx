import React from "react"
import { useNavigate } from "react-router-dom"
import { IconEdit, IconInfoCircle, IconTrashX } from "@tabler/icons-react"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "../../buttons/Button"

const UserActions = ({ id, onRefresh }) => {
  const navigate = useNavigate()
  const { deleteModal } = useAdmin()
  const { t } = useLocale()

  const buttons = [
    {
      label: "ui.buttons.info",
      svg: <IconInfoCircle />,
      variant: "info",
      onClick: () => navigate(`/admin/users/${id}`),
      tooltip: "tooltip-info",
    },
    {
      label: "ui.buttons.edit",
      svg: <IconEdit />,
      variant: "warning",
      onClick: () => navigate(`/admin/users/edit/${id}`),
      tooltip: "tooltip-warning",
    },
    {
      label: "ui.buttons.delete",
      svg: <IconTrashX />,
      variant: "error",
      onClick: () => deleteModal(id, onRefresh),
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
