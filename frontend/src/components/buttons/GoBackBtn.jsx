import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"
import ChevronLeftSVG from "../svg/actions/ChevronLeftSVG"
import Button from "./Button"

const GoBackBtn = ({ link }) => {
  const { t } = useLocale()
  const navigate = useNavigate()
  return (
    <Button
      variant="neutral"
      svg={<ChevronLeftSVG />}
      onClick={() => navigate(link || -1)}>
      {t("forms.buttons.goBack")}
    </Button>
  )
}

export default GoBackBtn
