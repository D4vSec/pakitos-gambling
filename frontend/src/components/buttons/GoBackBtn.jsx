import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"
import ChevronLeft from "../svg/actions/ChevronLeft"
import Button from "./Button"

const GoBackBtn = ({ link }) => {
  const { t } = useLocale()
  const navigate = useNavigate()
  return (
    <Button
      variant="neutral"
      svg={<ChevronLeft />}
      onClick={() => navigate(link || -1)}>
      {t("forms.buttons.goBack")}
    </Button>
  )
}

export default GoBackBtn
