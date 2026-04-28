import React from "react"
import EditSVG from "../svg/EditSVG"
import Button from "../buttons/Button"
import TrashXSVG from "../svg/TrashXSVG"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "@/providers/AdminProvider"

const Actions = ({ id }) => {
  const navigate = useNavigate()
  const { deleteModal } = useAdmin()
  const buttons = [
    {
      label: "Edit",
      svg: <EditSVG />,
      variant: "secondary",
      onClick: () => navigate(`/admin/users/edit/${id}`),
    },
    {
      label: "Delete",
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
          {button.label}
        </Button>
      ))}
    </div>
  )
}

export default Actions
