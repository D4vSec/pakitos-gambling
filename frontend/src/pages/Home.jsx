import React from "react"
import CarrouselBanner from "../components/home/CarrouselBanner.jsx"
import CapyroadSection from "@/components/home/CapyroadSection.jsx"
import SlotsSection from "@/components/home/SlotsSection.jsx"
import RouletteSection from "@/components/home/RouletteSection.jsx"
import BlackjackSection from "@/components/home/BlackjackSection.jsx"
import HomeSkeleton from "@/components/home/HomeSkeleton.jsx"

const Home = () => {
  return (
    <div className="min-h-full px-4 py-4 md:px-12 md:py-6 lg:px-24 lg:py-12 xl:px-28 xl:py-12">
      <div className="flex flex-col gap-18">
        <CarrouselBanner />
        <SlotsSection />
        <RouletteSection />
        <BlackjackSection />
        <CapyroadSection />
      </div>
      <HomeSkeleton />
    </div>
  )
}

export default Home
