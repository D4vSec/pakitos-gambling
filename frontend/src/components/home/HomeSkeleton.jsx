import React, { Suspense, lazy } from "react"
import Carrousel from "./Carrousel"

const ExploreGames = lazy(() => import("./ExploreGames"))
const RandomGame = lazy(() => import("./RandomGame"))

const SectionFallback = () => <div className="min-h-56 rounded-3xl bg-base-200/60 animate-pulse" />

const HomeSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-10 md:gap-14">
      <Carrousel />

      <Suspense fallback={<SectionFallback />}>
        <ExploreGames />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <RandomGame />
      </Suspense>
    </div>
  )
}

export default HomeSkeleton
