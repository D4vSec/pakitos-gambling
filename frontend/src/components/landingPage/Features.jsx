import React from "react"
import Card from "./Card"
import { useLocale } from "@/providers/LocaleProvider"
import TrophySVG from "../svg/pictures/TrophySVG"
import ControllerSVG from "../svg/pictures/ControllerSVG"
import ShieldSVG from "../svg/pictures/ShieldSVG"
import StarSVG from "../svg/pictures/StarSVG"
import BoltSVG from "../svg/pictures/BoltSVG"
import UserSVG from "../svg/users/UserSVG"

const Features = () => {
  const { t } = useLocale()

  const featureKeys = [1, 2, 3, 4, 5, 6]
  const icons = [
    <ControllerSVG />,
    <TrophySVG />,
    <ShieldSVG />,
    <BoltSVG />,
    <UserSVG />,
    <StarSVG />,
  ]

  return (
    <section className="mb-16">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {t("pages.landingPage.features.title")}
        </h2>
        <p className="text-lg text-muted-foreground text-center py-4">
          {t("pages.landingPage.features.text")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {featureKeys.map((num) => {
          const title = t(`pages.landingPage.features.items.${num}.title`)
          const description = t(
            `pages.landingPage.features.items.${num}.description`,
          )

          return (
            <Card
              key={num}
              className="p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                {icons[num - 1]}
              </div>
              <h3 className="text-xl font-bold mb-2 py-2">{title}</h3>
              <p className="text-muted-foreground leading-relaxed text-1xs">
                {description}
              </p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default Features
