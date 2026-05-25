import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"

const CTA = () => {
  const { t } = useLocale()
  const navigate = useNavigate()
  return (
    <section className="relative overflow-hidden px-4 md:px-6 lg:px-10">
      <div className="bg-linear-to-r from-primary/20 to-primary/10 border border-primary/30 p-8 md:p-12 text-center rounded-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("pages.landingPage.cta.title")}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("pages.landingPage.cta.text")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => navigate("/register")}>
            {t("pages.landingPage.cta.join")}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate("/home")}>
            {t("pages.landingPage.cta.exploreGames")}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTA
