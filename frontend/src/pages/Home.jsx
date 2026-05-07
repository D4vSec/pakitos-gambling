import React from "react"
import HomeSkeleton from "@/components/home/HomeSkeleton.jsx"

const Home = () => {
  return (
    <div className="min-h-full px-4 py-4 md:px-12 md:py-6 lg:px-24 lg:py-12 2xl:px-52 xl:py-12">
      <HomeSkeleton />
    </div>
  )
}

export default Home
