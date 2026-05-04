import React from "react"
import CarrouselBanner from "../components/home/CarrouselBanner.jsx"
import CapyroadSection from "@/components/home/CapyroadSection.jsx"
import SlotsSection from "@/components/home/SlotsSection.jsx"
import RouletteSection from "@/components/home/RouletteSection.jsx"
import BlackjackSection from "@/components/home/BlackjackSection.jsx"

const Home = () => {
  return (
    <div className="min-h-full px-4 py-4 md:px-6 md:py-6 lg:px-10 lg:py-10">
      <CarrouselBanner />
      <SlotsSection />
      <RouletteSection />
      <BlackjackSection />
      <CapyroadSection />
    </div>
  )
}

export default Home
