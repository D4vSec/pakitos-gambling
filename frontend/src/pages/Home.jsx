import React from "react";
import CarrouselBanner from "../components/home/CarrouselBanner.jsx";
import SlotsCard from "@/components/home/SlotsCard.jsx";
import RouletteCard from "@/components/home/RouletteCard.jsx";
import BlackjackCard from "@/components/home/BlackjackCard.jsx";
const Home = () => {
  return (
    <div className="min-h-full px-4 py-4 md:px-6 md:py-6 lg:px-10 lg:py-10">
      <CarrouselBanner />

      {/*SLOTS*/}
      <SlotsCard />

      {/*ROULETTE */}
      <RouletteCard />

      {/*BLACKJACK*/}
      <BlackjackCard />
    </div>
  );
};

export default Home;
