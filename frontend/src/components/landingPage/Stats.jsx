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
    },
    {
      value: "10K+",
      label: t("pages.landingPage.stats.players"),
    },
    {
      value: "24/7",
      label: t("pages.landingPage.stats.support"),
    },
    {
      value: "$1M+",
      label: t("pages.landingPage.stats.prizes"),
    },
  ]

  return (
    <section className="px-4 md:px-6 lg:px-10">
      <div className="stats stats-vertical gap-4 lg:stats-horizontal shadow w-full">
        {stats.map((item, index) => (
          <div key={index} className="stat bg-base-100 place-items-center">
            <div className="stat-value text-secondary">{item.value}</div>
            <div className="stat-desc text-secondary">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
