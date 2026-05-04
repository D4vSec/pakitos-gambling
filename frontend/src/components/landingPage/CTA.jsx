import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"

const CTA = () => {
  const { t } = useLocale()
  return (
    <section className="relative overflow-hidden rounded-xl">
      <div className="bg-linear-to-r from-primary/20 to-primary/10 border border-primary/30 p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("pages.landingPage.cta.title")}
        </h2>
        <p className="text-lg text-muted-foreground  mb-8 max-w-2xl mx-auto">
          {t("pages.landingPage.cta.text")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg">
            {t("pages.landingPage.cta.join")}
          </Button>
          <Button variant="accent" size="lg">
            {t("pages.landingPage.cta.exploreGames")}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTA
