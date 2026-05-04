import React, { useEffect, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import Button from "../buttons/Button"

const images = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTumNkmB-Q13m4UcQe-6uo_J0P8UCw1UBIWQ&s",
  "https://static.posters.cz/image/hp/75998.jpg",
  "https://www.teleadhesivo.com/es/img/asfs648-png/folder/products-detalle-png/pegatinas-coches-motos-bar-moes.png",
]

const DURATION = 0.55
const INTERVAL_MS = 3500

const CarrouselBanner = () => {
  const imgRefs = useRef([])
  const dotsRef = useRef([])
  const currentRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const intervalRef = useRef(null)

  // Set initial positions before first paint to avoid flash
  useLayoutEffect(() => {
    imgRefs.current.forEach((img, i) => {
      if (!img) return
      gsap.set(img, { x: i === 0 ? "0%" : "100%" })
    })
  }, [])

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [])

  const updateDots = (index) => {
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return
      gsap.to(dot, {
        scaleX: i === index ? 2.5 : 1,
        opacity: i === index ? 1 : 0.4,
        duration: 0.3,
        ease: "power2.out",
      })
    })
  }

  const advanceTo = (targetIndex, dir) => {
    if (isAnimatingRef.current) return
    if (targetIndex === currentRef.current) return

    const from = currentRef.current
    isAnimatingRef.current = true

    // Position incoming slide on the correct side before animating
    gsap.set(imgRefs.current[targetIndex], { x: dir > 0 ? "100%" : "-100%" })

    gsap
      .timeline({
        defaults: { duration: DURATION, ease: "power2.inOut" },
        onComplete: () => {
          // Park the outgoing slide off-screen right (neutral ready state)
          gsap.set(imgRefs.current[from], { x: "100%" })
          currentRef.current = targetIndex
          isAnimatingRef.current = false
          updateDots(targetIndex)
        },
      })
      .to(imgRefs.current[from], { x: dir > 0 ? "-100%" : "100%" }, 0)
      .to(imgRefs.current[targetIndex], { x: "0%" }, 0)
  }

  const startAutoPlay = () => {
    stopAutoPlay()
    intervalRef.current = setInterval(() => {
      advanceTo((currentRef.current + 1) % images.length, 1)
    }, INTERVAL_MS)
  }

  const stopAutoPlay = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  const handleNext = () => {
    advanceTo((currentRef.current + 1) % images.length, 1)
    startAutoPlay()
  }

  const handlePrev = () => {
    advanceTo((currentRef.current - 1 + images.length) % images.length, -1)
    startAutoPlay()
  }

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-8 h-[224px] md:h-[360px]">
      {/* Slide window */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {images.map((src, i) => (
          <img
            key={i}
            ref={(el) => {
              imgRefs.current[i] = el
            }}
            src={src}
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain select-none"
            alt={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev button */}
      <Button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full">
        &lt;
      </Button>

      {/* Next button */}
      <Button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full">
        &gt;
      </Button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            ref={(el) => {
              dotsRef.current[i] = el
            }}
            onClick={() => {
              advanceTo(i, i > currentRef.current ? 1 : -1)
              startAutoPlay()
            }}
            className="h-2 w-2 rounded-full bg-white origin-center"
            style={{
              opacity: i === 0 ? 1 : 0.4,
              transform: i === 0 ? "scaleX(2.5)" : "scaleX(1)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default CarrouselBanner
