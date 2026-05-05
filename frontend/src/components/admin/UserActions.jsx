import React from "react"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import EditSVG from "../svg/actions/EditSVG"
import Button from "../buttons/Button"
import TrashXSVG from "../svg/actions/TrashXSVG"
import InfoSVG from "../svg/actions/InfoSVG"

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
    },
    {
      label: "ui.buttons.edit",
      svg: <EditSVG />,
      variant: "warning",
      onClick: () => navigate(`/admin/users/edit/${id}`),
    },
    {
      label: "ui.buttons.delete",
      svg: <TrashXSVG />,
      variant: "danger",
      onClick: () => deleteModal(id),
    },
  ]
  return (
    <div className="flex gap-2">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant}
          size={"sm"}
          svg={button.svg}
          onClick={button.onClick}>
          {t(button.label)}
        </Button>
      ))}
    </div>
  )
}

export default UserActions
