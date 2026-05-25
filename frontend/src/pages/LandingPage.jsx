import React, { Suspense, lazy } from "react"
import HeroSection from "../components/landingPage/HeroSection"

const Features = lazy(() => import("../components/landingPage/Features"))
const ImagesGrid = lazy(() => import("../components/landingPage/ImagesGrid"))
const CTA = lazy(() => import("../components/landingPage/CTA"))
const Stats = lazy(() => import("../components/landingPage/Stats"))

const SectionFallback = () => <div className="min-h-64 rounded-2xl bg-base-200/60 animate-pulse" />

const LandingPage = () => {
  return (
    <div className="grid grid-rows-[auto] gap-12 md:gap-18 mb-18">
      <HeroSection />
      <Suspense fallback={<SectionFallback />}>
        <Features />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ImagesGrid />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CTA />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Stats />
      </Suspense>
    </div>
  )
}

export default LandingPage
