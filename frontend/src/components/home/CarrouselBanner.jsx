import React, { useState, useEffect } from "react";
import Button from "../buttons/Button";

const CarrouselBanner = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTumNkmB-Q13m4UcQe-6uo_J0P8UCw1UBIWQ&s",
    "https://static.posters.cz/image/hp/75998.jpg",
    "https://www.teleadhesivo.com/es/img/asfs648-png/folder/products-detalle-png/pegatinas-coches-motos-bar-moes.png",
  ];

  const changeSlide = (direction) => {
    if (isTransitioning) return;

    const newIndex =
      direction === "next"
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;

    setNext(newIndex);
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrent(newIndex);
      setIsTransitioning(false);
    }, 500);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        changeSlide("next");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  return (
    <>
      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-8 h-[224px] md:h-[360px] overflow-hidden rounded-lg">
        <img
          src={images[current]}
          className={`absolute w-full h-full object-contain transition-opacity duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          alt={`Slide ${current + 1}`}
        />

        <img
          src={images[next]}
          className={`absolute w-full h-full object-contain transition-opacity duration-500 ${
            isTransitioning ? "opacity-100" : "opacity-0"
          }`}
          alt={`Slide ${next + 1}`}
        />

        <Button
          onClick={() => changeSlide("prev")}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          &lt;
        </Button>

        <Button
          onClick={() => changeSlide("next")}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          &gt;
        </Button>
      </div>
    </>
  );
};

export default CarrouselBanner;
