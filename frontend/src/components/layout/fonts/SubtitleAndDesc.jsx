import React from "react"
import Subtitle from "./Subtitle"
import Desc from "./Desc"

const SubtitleAndDesc = ({ subtitle, desc }) => {
  return (
    <div className="text-center mb-10 flex flex-col gap-3">
      <Subtitle>{subtitle}</Subtitle>
      <Desc>{desc}</Desc>
    </div>
  )
}

export default SubtitleAndDesc
