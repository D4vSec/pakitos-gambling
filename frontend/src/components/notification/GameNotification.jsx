import React from "react"
import InfoSVG from "../svg/InfoSVG"
import CheckSVG from "../svg/CheckSVG"
import AlertTriangleSVG from "../svg/AlertTriangleSVG"
import CircleXSVG from "../svg/CircleXSVG"

const GameNotification = ({ notification }) => {
  const typeClasses = {
    info: "bg-blue-500/90",
    success: "bg-green-500/90",
    warning: "bg-yellow-500/90",
    error: "bg-red-500/90",
  }

  const svg = {
    info: <InfoSVG />,
    success: <CheckSVG />,
    warning: <AlertTriangleSVG />,
    error: <CircleXSVG />,
  }

  return (
    <div
      className={`
        flex items-center gap-4
        px-6 py-5
        min-w-[320px]
        max-w-lg
        rounded-2xl
        text-white
        shadow-2xl
        backdrop-blur-md
        border border-white/20
        ${typeClasses[notification.type] || "bg-gray-700/90"}

        animate-pop
      `}>
      <div className="w-10 h-10 flex items-center justify-center">
        {svg[notification.type]}
      </div>

      <span className="text-lg font-semibold">{notification.message}</span>
    </div>
  )
}

export default GameNotification
