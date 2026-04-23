import React, { useRef } from "react"
import Road from "./roads/Road"
import Capybara from "./Capybara"

const Capyroad = () => {
  const containerRef = useRef(null)

  return (
    <div
      ref={containerRef}
      className="
        w-full h-full 
        overflow-x-auto overflow-y-hidden 
        scroll-smooth
      "
      style={{
        overscrollBehavior: "none",
      }}>
      <div className="grid grid-flow-col auto-cols-fr w-max h-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <Road key={i} start={i === 0}>
            {i === 0 && <Capybara />}
          </Road>
        ))}
      </div>
    </div>
  )
}

export default Capyroad
