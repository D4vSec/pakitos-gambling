import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

import TrophySVG from "../svg/pictures/TrophySVG"
import ControllerSVG from "../svg/pictures/ControllerSVG"
import StarSVG from "../svg/pictures/StarSVG"
import BoltSVG from "../svg/pictures/BoltSVG"
import UserSVG from "../svg/users/UserSVG"
import SubtitleAndDesc from "../layout/fonts/SubtitleAndDesc"
import FeatureCard from "./FeatureCard"
import ShieldSVG from "../svg/pictures/ShieldSVG"

const Features = () => {
  const { t } = useLocale()

  const features = [
    { key: 1, icon: <ControllerSVG /> },
    { key: 2, icon: <ShieldSVG /> },
    { key: 3, icon: <TrophySVG /> },
    { key: 4, icon: <BoltSVG /> },
    { key: 5, icon: <UserSVG /> },
    { key: 6, icon: <StarSVG /> },
  ]

  return (
    <section className="px-4 md:px-6 lg:px-10">
      <SubtitleAndDesc
        subtitle={t("pages.landingPage.features.title")}
        desc={t("pages.landingPage.features.text")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map(({ key, icon }) => (
          <FeatureCard
            key={key}
            title={t(`pages.landingPage.features.items.${key}.title`)}
            description={t(`pages.landingPage.features.items.${key}.description`)}
            icon={icon}
          />
        ))}
      </div>
    </section>
  )
}

export default Features
