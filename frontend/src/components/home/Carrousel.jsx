import React, { useEffect, useState } from "react"
import { useLocale } from "@/providers/LocaleProvider"
import NavigationBtn from "../buttons/NavigationBtn"
import Button from "../buttons/Button"

import BlackjackImg from "@/assets/home/carrousel/blackjackBanner.jpg"
import Roulette00Img from "@/assets/home/carrousel/roulette00Banner.webp"
import Roulette0Img from "@/assets/home/carrousel/roulette0Banner.png"
import CapybaraImg from "@/assets/home/carrousel/capybaraBanner.webp"
import StarWarsImg from "@/assets/home/carrousel/starWarsBanner.webp"
import StardewValleyImg from "@/assets/home/carrousel/stardewValleyBanner.webp"
import BeerManImg from "@/assets/home/carrousel/beermanBanner.webp"

const slides = [
  {
    id: 1,
    game: "blackjack",
    route: "/blackjack",
    image: BlackjackImg,
  },
  {
    id: 2,
    game: "roulette.classic",
    route: "/roulette0",
    image: Roulette0Img,
  },
  {
    id: 3,
    game: "roulette.american",
    route: "/roulette00",
    image: Roulette00Img,
  },
  {
    id: 4,
    game: "slots.starwars",
    route: "/slots/starwars",
    image: StarWarsImg,
  },
  {
    id: 5,
    game: "slots.stardewValley",
    route: "/slots/stardewvalley",
    image: StardewValleyImg,
  },
  {
    id: 6,
    game: "slots.beer",
    route: "/slots/beerman",
    image: BeerManImg,
  },
  {
    id: 7,
    game: "capyroad",
    route: "/capyroad",
    image: CapybaraImg,
  },
]

const Carrousel = () => {
  const { t } = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  return (
    <section className="w-full group">
      <div className="relative h-64 md:h-86 rounded-2xl overflow-hidden bg-black shadow-xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
            }`}
          >
            <img
              src={slide.image}
              alt={t(`pages.home.cards.${slide.game}.title`)}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-black/40 to-accent/20" />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-transparent to-black/40" />

            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 space-y-2 md:space-y-3 max-w-sm md:max-w-md z-30">
              <h3 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg leading-none">
                {t(`pages.home.cards.${slide.game}.title`)}
              </h3>

              <p className="text-xs md:text-sm text-white/90 leading-relaxed line-clamp-2 font-medium">
                {t(`pages.home.cards.${slide.game}.description`)}
              </p>

              <div className="pt-1">
                <NavigationBtn to={slide.route}>{t("pages.home.cards.playNow")}</NavigationBtn>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          unstyled
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 opacity-0 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white active:scale-90 group-hover:opacity-100"
        >
          <span className="text-2xl -mt-1">&lsaquo;</span>
        </Button>

        <Button
          type="button"
          unstyled
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 opacity-0 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white active:scale-90 group-hover:opacity-100"
        >
          <span className="text-2xl -mt-1">&rsaquo;</span>
        </Button>

        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex gap-2 items-center bg-black/30 backdrop-blur-sm p-2 rounded-full border border-white/5">
          {slides.map((slide) => (
            <Button
              key={slide.id}
              type="button"
              unstyled
              onClick={() => setCurrentIndex(slide.id - 1)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === slide.id - 1
                  ? "w-6 h-1.5 md:w-8 md:h-2 bg-primary shadow-[0_0_8px_rgba(var(--p),0.5)]"
                  : "w-1.5 h-1.5 md:w-2 md:h-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${slide.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Carrousel
