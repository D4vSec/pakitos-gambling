import React from "react"
import { useNotification } from "@/providers/NotificationProvider"

const TruncateId = ({ id }) => {
  const { addNotification } = useNotification()
  const shortId = `${id.slice(0, 4)}...${id.slice(-4)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(id)
    addNotification("ID copied to clipboard", "info")
  }

  return (
    <div
      className="tooltip tooltip-top cursor-pointer"
      data-tip={id}
      onClick={handleCopy}>
      <span className="font-mono text-sm hover:text-primary transition-colors">
        {shortId}
      </span>
    </div>
  )
}

export default TruncateId
