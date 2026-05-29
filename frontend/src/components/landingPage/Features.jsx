import React from "react"
import { useLocale } from "@/providers/LocaleProvider"

import {
  IconBolt,
  IconDeviceGamepad2,
  IconShield,
  IconStar,
  IconTrophy,
  IconUser,
} from "@tabler/icons-react"
import SubtitleAndDesc from "../layout/fonts/SubtitleAndDesc"
import FeatureCard from "./FeatureCard"

const Features = () => {
  const { t } = useLocale()

  const features = [
    { key: 1, icon: <IconDeviceGamepad2 /> },
    { key: 2, icon: <IconShield /> },
    { key: 3, icon: <IconTrophy /> },
    { key: 4, icon: <IconBolt /> },
    { key: 5, icon: <IconUser /> },
    { key: 6, icon: <IconStar /> },
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
