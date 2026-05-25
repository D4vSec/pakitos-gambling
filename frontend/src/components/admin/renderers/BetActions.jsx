import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/buttons/Button"
import CloseSVG from "@/components/svg/actions/CloseSVG"
import EditSVG from "@/components/svg/actions/EditSVG"
import InfoSVG from "@/components/svg/actions/InfoSVG"
import TrashXSVG from "@/components/svg/actions/TrashXSVG"
import { useLocale } from "@/providers/LocaleProvider"
import { useAdmin } from "@/providers/AdminProvider"

const BetActions = ({ id, label, status, onRefresh }) => {
  const navigate = useNavigate()
  const { t } = useLocale()
  const { closeBetModal, deleteBetModal } = useAdmin()

  const buttons = [
    {
      label: "ui.tooltip.viewDetails",
      svg: <InfoSVG />,
      variant: "info",
      onClick: () => navigate(`/admin/bets/${id}`),
      tooltip: "tooltip-info",
    },
    {
      label: "ui.buttons.edit",
      svg: <EditSVG />,
      variant: "warning",
      onClick: () => navigate(`/admin/bets/edit/${id}`),
      tooltip: "tooltip-warning",
    },
    {
      label: "adminPanel.bets.detail.closeBet",
      svg: <CloseSVG />,
      variant: "secondary",
      onClick: () => closeBetModal(id, label, onRefresh),
      tooltip: "tooltip-secondary",
      disabled: status === "closed",
    },
    {
      label: "ui.buttons.delete",
      svg: <TrashXSVG />,
      variant: "error",
      onClick: () => deleteBetModal(id, label, onRefresh),
      tooltip: "tooltip-error",
    },
  ]

  return (
    <div className="flex gap-2">
      {buttons.map((button) => (
        <div
          key={button.label}
          className={`tooltip tooltip-top cursor-pointer ${button.tooltip}`}
          data-tip={t(button.label)}>
          <Button
            type="button"
            variant={button.variant}
            size="sm"
            svg={button.svg}
            onClick={button.onClick}
            disabled={button.disabled}
          />
        </div>
      ))}
    </div>
  )
}

export default BetActions
