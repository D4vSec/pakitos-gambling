import React from "react"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import EditSVG from "../svg/EditSVG"
import Button from "../buttons/Button"
import TrashXSVG from "../svg/TrashXSVG"
import InfoSVG from "../svg/InfoSVG"

const UserActions = ({ id }) => {
  const navigate = useNavigate()
  const { deleteModal } = useAdmin()
  const { t } = useLocale()

  const buttons = [
    {
      label: "buttons.info",
      svg: <InfoSVG />,
      variant: "info",
      onClick: () => navigate(`/admin/users/${id}`),
    },
    {
      label: "buttons.edit",
      svg: <EditSVG />,
      variant: "warning",
      onClick: () => navigate(`/admin/users/edit/${id}`),
    },
    {
      label: "buttons.delete",
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
