import React, { useState } from "react"
import JsonView from "@uiw/react-json-view"
import Button from "../../buttons/Button"
import "./ActionDetails.css"
import { useLocale } from "@/providers/LocaleProvider"

const ActionDetails = ({ value }) => {
  const [selectedJson, setSelectedJson] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const { t } = useLocale()

  const openModal = () => {
    setSelectedJson(value)
    setMounted(true)
    requestAnimationFrame(() => {
      setVisible(true)
    })
  }

  const closeModal = () => {
    setVisible(false)
    setTimeout(() => {
      setMounted(false)
      setSelectedJson(null)
    }, 1000)
  }

  return (
    <>
      <div
        className="tooltip tooltip-top cursor-pointer pt-1"
        data-tip={t("ui.tooltip.viewDetails")}
        onClick={openModal}>
        <div className="cursor-pointer font-mono truncate max-w-50 hover:bg-zinc-800 transition-colors transition-200">
          {JSON.stringify(value)}
        </div>
      </div>

      {mounted && (
        <div
          onClick={closeModal}
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/50
            transition-all duration-200 ease-out
            ${visible ? "opacity-100" : "opacity-0"}
          `}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`
              modal-box w-[95vw] max-w-5xl
              bg-base-100
              rounded-box
              transition-all duration-200 ease-out
              ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
            `}>
            <h3 className="font-bold text-lg mb-4">
              {t("message.modal.logDetail.jsonDetail")}
            </h3>

            <div className="json-daisy bg-base-200 rounded-box p-3 font-mono text-xs overflow-auto max-h-[60vh]">
              <JsonView
                value={selectedJson}
                collapsed={false}
                displayObjectSize={false}
                displayDataTypes={false}
                enableClipboard={false}
              />
            </div>

            <div className="modal-action">
              <Button onClick={closeModal}>{t("ui.buttons.close")}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ActionDetails
