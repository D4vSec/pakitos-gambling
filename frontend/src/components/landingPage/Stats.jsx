import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import ControllerSVG from "../svg/pictures/ControllerSVG"
import GroupSVG from "../svg/users/GroupSVG"
import TwentyFourHSVG from "../svg/pictures/TwentyFourHSVG"
import DolarSVG from "../svg/pictures/DolarSVG"

const Stats = () => {
  const { t } = useLocale()

  const stats = [
    {
      value: "100+",
      label: t("pages.landingPage.stats.games"),
      icon: <ControllerSVG />,
    },
    {
      value: "10K+",
      label: t("pages.landingPage.stats.players"),
      icon: <GroupSVG />,
    },
    {
      value: "24/7",
      label: t("pages.landingPage.stats.support"),
      icon: <TwentyFourHSVG />,
    },
    {
      value: "$1M+",
      label: t("pages.landingPage.stats.prizes"),
      icon: <DolarSVG />,
    },
  ]

  return (
    <section className="mt-16">
      <div className="stats stats-vertical gap-4 lg:stats-horizontal shadow w-full">
        {stats.map((item, index) => (
          <div key={index} className="stat bg-base-100 place-items-center">
            {item.icon && (
              <div className="stat-figure text-primary">{item.icon}</div>
            )}

            <div className="stat-value text-primary">{item.value}</div>

            <div className="stat-title text-secondary">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
