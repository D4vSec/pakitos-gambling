import React from "react"
import capybaraImg from "@/assets/games/capybara.webp"

const Capybara = ({ crashed = false }) => {
  return (
    <div className={`z-10 w-28 md:w-32 transition-all ${crashed ? "grayscale scale-90" : ""}`}>
      <img src={capybaraImg} alt="Capybara" />
    </div>
  )
}

export default Capybara
