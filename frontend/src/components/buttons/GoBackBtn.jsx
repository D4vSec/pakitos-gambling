import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { IconChevronLeft } from "@tabler/icons-react"
import NavigationBtn from "./NavigationBtn"

const GoBackBtn = ({ link }) => {
  const { t } = useLocale()
  return (
    <NavigationBtn variant="neutral" svg={<IconChevronLeft />} to={link || -1}>
      {t("forms.buttons.goBack")}
    </NavigationBtn>
  )
}

export default GoBackBtn
