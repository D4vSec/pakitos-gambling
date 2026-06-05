import React from "react"
import NavigationBtn from "@/components/buttons/NavigationBtn"
import { useLocale } from "@/providers/LocaleProvider"
import { useSession } from "@/providers/SessionProvider"

const HeroContent = () => {
  const { t } = useLocale()
  const { isLogged } = useSession()
  return (
    <div className="px-6 md:px-12 w-full">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
          {t("pages.landingPage.hero.title")}
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
          {t("pages.landingPage.hero.text")}
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <NavigationBtn
            variant="primary"
            size="lg"
            className="btn-lg md:btn-xl"
            to="/register">
            {t("pages.landingPage.hero.join")}
          </NavigationBtn>

          <NavigationBtn
            variant="secondary"
            size="lg"
            className="btn-lg md:btn-xl"
            to={isLogged ? "/home" : "/login"}>
            {t("pages.landingPage.hero.seeGames")}
          </NavigationBtn>
        </div>
      </div>
    </div>
  )
}

export default HeroContent
