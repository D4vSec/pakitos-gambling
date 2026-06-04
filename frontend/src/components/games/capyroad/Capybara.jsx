import React from "react"
import capybaraImg from "@/assets/games/capybara.webp"

const Capybara = ({ crashed = false }) => {
  return (
    <div
      className={`z-10 w-20 transition-all sm:w-24 md:w-28 xl:w-32 2xl:w-36 ${
        crashed ? "grayscale scale-90" : ""
      }`}>
      <img src={capybaraImg} alt="Capybara" />
    </div>
  )
}

export default Capybara
