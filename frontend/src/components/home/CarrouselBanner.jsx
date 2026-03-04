import React, { useState, useEffect } from "react";
import Button from "../buttons/Button";

const CarrouselBanner = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images = [
    "https://i.pinimg.com/1200x/ba/05/30/ba053027e388d7b5c84c2312684c75c3.jpg",
    "https://i.pinimg.com/736x/1f/80/ff/1f80ff5e30f970c3f09c507f89e6425b.jpg",
    "https://i.pinimg.com/1200x/d7/d9/23/d7d923f8d10821b6d482287241e7eebb.jpg",
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
    <div className="relative w-full max-w-375 h-56 md:h-64 mx-auto overflow-hidden rounded-lg">
      <img
        src={images[current]}
        className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        alt=""
      />

      <img
        src={images[next]}
        className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        alt=""
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
  );
};

export default CarrouselBanner;
