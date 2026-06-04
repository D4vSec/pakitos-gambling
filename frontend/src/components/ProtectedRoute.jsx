import React from "react"
import Title from "./layout/fonts/Title"
import GradientBg from "./layout/GradientBg"
import NavigationBtn from "./buttons/NavigationBtn"
import { useLocale } from "../providers/LocaleProvider"
import { useSession } from "../providers/SessionProvider"
import { IconLogin, IconHome } from "@tabler/icons-react"
import Loading from "./Loading"

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { t } = useLocale()
  const { isLogged, loading, user } = useSession()
  const requireLogged = true

  return loading ? (
    <Loading />
  ) : requireLogged && !isLogged ? (
    <GradientBg>
      <div className="flex flex-col gap-2 justify-center items-center">
        <Title>{t("message.error.noLogin")}</Title>
        <NavigationBtn
          variant="primary"
          size="lg"
          to="/login"
          svg={<IconLogin />}
          className="shadow-xl"
        >
          {t("ui.buttons.goLogin")}
        </NavigationBtn>
      </div>
    </GradientBg>
  ) : requireAdmin && user.role !== "admin" ? (
    <GradientBg>
      <div className="flex flex-col gap-2 justify-center items-center">
        <Title>{t("message.error.noAdmin")}</Title>
        <NavigationBtn
          variant="primary"
          size="lg"
          to={isLogged ? "/home" : "/"}
          svg={<IconHome />}
          className="shadow-xl"
        >
          {t("ui.buttons.returnHome")}
        </NavigationBtn>
      </div>
    </GradientBg>
  ) : (
    children
  )
}

export default ProtectedRoute
