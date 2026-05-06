import React from "react"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import CopySVG from "../../svg/actions/CopySVG"

const TruncateId = ({ id }) => {
  const { t } = useLocale()
  const { addNotification } = useNotification()
  const shortId = `${id.slice(0, 4)}...${id.slice(-4)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(id)
    addNotification(t("message.info.uuidCopiedToClipboard"), "info")
  }

  return (
    <div className="tooltip tooltip-top cursor-pointer" onClick={handleCopy}>
      <div className="tooltip-content flex gap-1 items-center justify-center">
        <span className="scale-[0.75]">
          <CopySVG />
        </span>
        {id}
      </div>
      <span className="font-mono text-sm hover:text-secondary hover:bg-zinc-800 transition-colors transition-200">
        {shortId}
      </span>
    </div>
  )
}

export default TruncateId
