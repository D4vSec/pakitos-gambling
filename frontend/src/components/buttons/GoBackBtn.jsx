import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { IconChevronLeft } from "@tabler/icons-react"
import NavigationBtn from "./NavigationBtn"

const GoBackBtn = ({ link, className }) => {
  const { t } = useLocale()
  return (
    <NavigationBtn
      variant="neutral"
      className={className}
      svg={<IconChevronLeft />}
      to={link || -1}>
      {t("forms.buttons.goBack")}
    </NavigationBtn>
  )
}

export default GoBackBtn
