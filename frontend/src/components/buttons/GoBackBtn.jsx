import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import ChevronLeftSVG from "../svg/actions/ChevronLeftSVG"
import NavigationBtn from "./NavigationBtn"

const GoBackBtn = ({ link }) => {
  const { t } = useLocale()
  return (
    <NavigationBtn
      variant="accent"
      svg={<ChevronLeftSVG />}
      to={link || -1}>
      {t("forms.buttons.goBack")}
    </NavigationBtn>
  )
}

export default GoBackBtn
