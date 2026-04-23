import React from "react"
import MultiplayerCircle from "./MultiplayerCircle"

const Road = ({ start, children }) => {
  return (
    <div
      className={`${start ? "bg-primary" : "bg-stone-500"} w-35 h-full grid grid-rows-[55%_35%] outline-1`}>
      <div>a</div>
      <div className="grid grid-cols-1 grid-rows-1 w-full h-full">
        <div className="col-start-1 row-start-1 flex items-center justify-center">
          <MultiplayerCircle />
        </div>

        <div className="col-start-1 row-start-1 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Road
