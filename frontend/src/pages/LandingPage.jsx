import React from "react";
import Stats from "../components/landingPage/Stats";
import HeroSection from "../components/landingPage/HeroSection";
import CTA from "../components/landingPage/CTA";
import ImagesGrid from "../components/landingPage/ImagesGrid";

const LandingPage = () => {
  return (
    <div>
      {/*Hero Section*/}
      <HeroSection />

      <section className="mb-16">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Por Qué Elegir Pakito's Gambling?
          </h2>
          <p className="text-lg text-muted-foreground">
            Ofrecemos una experiencia de casino premium con las mejores
            características del mercado y un compromiso total con la
            satisfacción del jugador.
          </p>
        </div>
        {/*Features Grid*/}

      </section>

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
