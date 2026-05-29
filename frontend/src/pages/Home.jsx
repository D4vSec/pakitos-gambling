import React, { useEffect, useState } from "react"
import HomeSkeleton from "@/components/home/HomeSkeleton.jsx"
import Loading from "@/components/Loading.jsx"
import BlackjackBannerImg from "@/assets/home/carrousel/blackjackBanner.jpg"
import Roulette00BannerImg from "@/assets/home/carrousel/roulette00Banner.webp"
import Roulette0BannerImg from "@/assets/home/carrousel/roulette0Banner.png"
import CapybaraBannerImg from "@/assets/home/carrousel/capybaraBanner.webp"
import StarWarsBannerImg from "@/assets/home/carrousel/starWarsBanner.webp"
import StardewValleyBannerImg from "@/assets/home/carrousel/stardewValleyBanner.webp"
import BeerManBannerImg from "@/assets/home/carrousel/beermanBanner.webp"

import BlackjackCardImg from "@/assets/home/cards/blackjack.png"
import Roulette00CardImg from "@/assets/home/cards/roulette00banner.jpg"
import Roulette0CardImg from "@/assets/home/cards/roulette0banner.webp"
import CapybaraCardImg from "@/assets/home/cards/capybara_packet_tracer.jpeg"
import StarWarsCardImg from "@/assets/home/cards/starwars.webp"
import StardewValleyCardImg from "@/assets/home/cards/stardewvalley.webp"
import BeerManCardImg from "@/assets/home/cards/beerman.jpeg"

const homeImages = [
  BlackjackBannerImg,
  Roulette00BannerImg,
  Roulette0BannerImg,
  CapybaraBannerImg,
  StarWarsBannerImg,
  StardewValleyBannerImg,
  BeerManBannerImg,
  BlackjackCardImg,
  Roulette00CardImg,
  Roulette0CardImg,
  CapybaraCardImg,
  StarWarsCardImg,
  StardewValleyCardImg,
  BeerManCardImg,
]

const Home = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    let isMounted = true

    const preloadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = resolve
        img.src = src

        if (img.complete) {
          resolve()
        }
      })

    Promise.all(homeImages.map(preloadImage)).then(() => {
      if (isMounted) {
        setImagesLoaded(true)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-full px-4 py-4 md:px-12 md:py-6 lg:px-24 lg:py-12 2xl:px-52 xl:py-12">
      {imagesLoaded ? <HomeSkeleton /> : <Loading clear />}
    </div>
  )
}

export default Home
