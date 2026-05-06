import React, { useEffect } from "react"
import Title from "./layout/fonts/Title"
import GradientBg from "./layout/GradientBg"
import Button from "./buttons/Button"
import { useLocale } from "../providers/LocaleProvider"
import { useSession } from "../providers/SessionProvider"
import { useNavigate } from "react-router-dom"
import Loading from "./Loading"

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { t } = useLocale()
  const { isLogged, loading, user } = useSession()
  const navigate = useNavigate()
  const requireLogged = true

  const ReturnBtn = ({ title, route }) => {
    return (
      <Button variant="primary" size="lg" onClick={() => navigate(route)}>
        {t(title)}
      </Button>
    )
  }

  return loading ? (
    <Loading />
  ) : requireLogged && !isLogged ? (
    <GradientBg>
      <Title>{t("message.error.noLogin")}</Title>
      <ReturnBtn title={"ui.buttons.goLogin"} route={"/login"} />
    </GradientBg>
  ) : requireAdmin && user.role !== "admin" ? (
    <GradientBg>
      <Title>{t("message.error.noAdmin")}</Title>
      <ReturnBtn
        title={"ui.buttons.returnHome"}
        route={isLogged ? "/home" : "/"}
      />
    </GradientBg>
  ) : (
    children
  )
}

export default ProtectedRoute
