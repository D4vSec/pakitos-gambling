import React from "react"
import capybaraImg from "@/assets/games/capyroad/capybara.png"

const Capybara = ({ crashed = false }) => {
  return (
    <div
      className={`relative z-10 flex items-end justify-center transition-all w-20 sm:w-24 md:w-28 xl:w-34 ${
        crashed ? "grayscale scale-90" : ""
      }`}
    >
      <img
        src={capybaraImg}
        alt="Capybara"
        className="block h-auto w-full max-w-none object-contain"
      />
    </div>
  )
}

export default Capybara
