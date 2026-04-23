import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"

const CapyroadActions = ({ disabled }) => {
  const { t } = useLocale()
  const buttons = [
    {
      label: "Cross",
      onClick: () => console.log("cossing"),
      variant: "neutral",
    },
    {
      label: "Cashout",
      onClick: () => console.log("cashing out"),
      variant: "primary",
    },
  ]

  return (
    <div className="w-full grid grid-cols-1 grid-row-2 gap-2">
      {buttons.map((btn, i) => (
        <Button
          key={i}
          variant={btn.variant}
          className="flex-1 min-w-fit"
          onClick={btn.onClick}
          disabled={disabled}>
          {t(btn.label)}
        </Button>
      ))}
    </div>
  )
}

export default CapyroadActions
