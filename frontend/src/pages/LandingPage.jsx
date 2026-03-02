import React from "react";
import Stats from "../components/landingPage/Stats";
import HeroSection from "../components/landingPage/HeroSection";
import CTA from "../components/landingPage/CTA";
import ImagesGrid from "../components/landingPage/ImagesGrid";
import Features from "../components/landingPage/Features";

const LandingPage = () => {

  return (
    <div className="px-4 md:px-6 lg:px-8">
      {/*Hero Section*/}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* Image Gallery Section */}
      <ImagesGrid />

      {/* CTA Section */}
      <CTA />

      {/*Stats Section*/}
      <Stats />
    </div>
  );
};

export default LandingPage;
