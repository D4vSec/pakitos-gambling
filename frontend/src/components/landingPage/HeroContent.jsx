import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"

const HeroContent = () => {
  const { t } = useLocale()
  const navigate = useNavigate()

  return (
    <div className="relative py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {t("pages.landingPage.hero.title")}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          {t("pages.landingPage.hero.text")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="primary"
            size="lg"
            className={"sm:btn-xl"}
            onClick={() => navigate("/register")}>
            {t("pages.landingPage.hero.join")}
          </Button>
          <Button
            variant="accent"
            size="lg"
            className={"sm:btn-xl"}
            onClick={() => navigate("/home")}>
            {t("pages.landingPage.hero.seeGames")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroContent
