import React from "react";
import HeroContent from "./HeroContent";
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-xl mb-12 min-h-[calc(100vh-4rem)] flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1726004592905-dc5cd794bda6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBnYW1pbmclMjBlbnRlcnRhaW5tZW50JTIwbmlnaHR8ZW58MXx8fHwxNzcyMTIzNDY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Casino Gaming"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      </div>

      {/* Hero Content */}
      <HeroContent />
    </section>
  );
};

export default HeroSection;
