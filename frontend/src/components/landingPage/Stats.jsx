import React from "react"
import Card from "./Card"
import { useLocale } from "@/providers/LocaleProvider"

const Stats = () => {
  const { t } = useLocale()
  return (
    <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
      <Card className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
          100+
        </div>
        <div className="text-muted-foreground">
          {t("pages.landingPage.stats.games")}
        </div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
          10K+
        </div>
        <div className="text-muted-foreground">
          {t("pages.landingPage.stats.players")}
        </div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
          24/7
        </div>
        <div className="text-muted-foreground">
          {t("pages.landingPage.stats.support")}
        </div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
          $1M+
        </div>
        <div className="text-muted-foreground">
          {t("pages.landingPage.stats.prizes")}
        </div>
      </Card>
    </section>
  )
}

export default Stats
