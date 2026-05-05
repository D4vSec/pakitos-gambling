import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import SubtitleAndDesc from "../layout/fonts/SubtitleAndDesc"
import slotTower from "@/assets/landing/slottower.jpeg"
import premium from "@/assets/landing/premium.jpeg"
import mobileSlot from "@/assets/landing/mobileslot.jpeg"
import ImageCard from "./ImageCard"

const ImagesGrid = () => {
  const { t } = useLocale()

  return (
    <section className="px-4 md:px-6 lg:px-10">
      <SubtitleAndDesc
        subtitle={t("pages.landingPage.imagesGrid.title")}
        desc={t("pages.landingPage.imagesGrid.text")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px] md:auto-rows-[240px]">
        <ImageCard
          title={t("pages.landingPage.imagesGrid.items.win.title")}
          text={t("pages.landingPage.imagesGrid.items.win.text")}
          img={slotTower}
          gradient="bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          className="md:col-span-1 md:row-span-2"
        />
        <ImageCard
          title={t("pages.landingPage.imagesGrid.items.premium.title")}
          text={t("pages.landingPage.imagesGrid.items.premium.text")}
          img={premium}
          gradient="bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          className="md:col-span-2 md:row-span-1"
        />
        <ImageCard
          title={t("pages.landingPage.imagesGrid.items.mobile.title")}
          text={t("pages.landingPage.imagesGrid.items.mobile.text")}
          img={mobileSlot}
          gradient="bg-gradient-to-r from-black/80 via-black/50 to-transparent"
          className="md:col-span-2 md:row-span-1"
        />
      </div>
    </section>
  )
}

export default ImagesGrid
