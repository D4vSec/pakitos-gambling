import React from "react"
import { IconCopy } from "@tabler/icons-react"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"

const TruncateId = ({ id }) => {
  const { t } = useLocale()
  const { addNotification } = useNotification()

  if (!id) {
    return t("ui.labels.redacted")
  }

  const shortId = `${id.slice(0, 4)}...${id.slice(-4)}`

  const handleCopy = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      await navigator.clipboard.writeText(id)
      addNotification(t("message.info.uuidCopiedToClipboard"), "info")
    } catch {
      addNotification(t("message.error.UNEXPECTED_ERROR"), "error")
    }
  }

  return (
    <div className="tooltip tooltip-top">
      <div className="tooltip-content flex items-center justify-center gap-1">
        <span className="scale-[0.75]">
          <IconCopy />
        </span>
        {id}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="cursor-pointer font-mono text-sm transition-colors transition-200 hover:bg-zinc-800 hover:text-secondary">
        {shortId}
      </button>
    </div>
  )
}

export default TruncateId
