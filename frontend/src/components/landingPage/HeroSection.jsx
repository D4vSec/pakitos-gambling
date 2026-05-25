import React from "react"
import HeroContent from "./HeroContent"
import herobg from "@/assets/landing/herobg.jpeg"

const HeroSection = () => {
  return (
    <section className="w-full h-[calc(100dvh-4.25rem)] p-4 md:p-6 lg:p-10">
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={herobg}
            alt="Casino Gaming"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/50" />
        </div>

        {/* Contenido centrado */}
        <div className="relative z-10 flex items-center h-full justify-center md:justify-start text-center md:text-left">
          <HeroContent />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
