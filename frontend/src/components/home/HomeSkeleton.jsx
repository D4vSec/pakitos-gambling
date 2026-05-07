import React from "react"
import Carrousel from "./Carrousel"
import RecentEarnings from "./RecentEarnings"
import Categories from "./Categories"
import ExploreGames from "./ExploreGames"
import RandomGame from "./RandomGame"

const HomeSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-10 md:gap-14">
      {/* 🔥 HERO FEATURED */}
      <Carrousel />

      {/* 💰 RECENT EARNINGS */}

      {/* 🧩 CATEGORIES */}

      {/* 🎮 MAIN GRID */}
      <ExploreGames />

      {/* 🎲 CTA */}
      <RandomGame />
    </div>
  )
}

export default HomeSkeleton
