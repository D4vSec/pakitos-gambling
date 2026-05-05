import React from "react"
import Stats from "../components/landingPage/Stats"
import HeroSection from "../components/landingPage/HeroSection"
import CTA from "../components/landingPage/CTA"
import ImagesGrid from "../components/landingPage/ImagesGrid"
import Features from "../components/landingPage/Features"

const LandingPage = () => {
  return (
    <div className="grid grid-rows-[auto] gap-18 mb-18">
      <HeroSection />
      <Features />
      <ImagesGrid />
      <CTA />
      <Stats />
    </div>
  )
}

export default LandingPage
