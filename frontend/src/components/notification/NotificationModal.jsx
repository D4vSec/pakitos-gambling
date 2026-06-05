import React, { useState } from "react"
import { useNotification } from "@/providers/NotificationProvider.jsx"
import Button from "@/components/buttons/Button.jsx"

const NotificationModal = ({ notification }) => {
  const { removeNotification } = useNotification()
  const { id, message, options } = notification
  const [open, setOpen] = useState(true)
  const showCancel = options?.showCancel !== false

  const accept = () => {
    options?.onAccept?.()
    setOpen(false)
    removeNotification(id)
  }

  const cancel = () => {
    options?.onCancel?.()
    setOpen(false)
    setTimeout(() => {
      removeNotification(id)
    }, 500)
  }

  return (
    <dialog
      id="my_modal_5"
      className={`modal ${open === true ? "modal-open" : "modal-close"} modal-bottom sm:modal-middle max-h-dvh`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center mb-6">{message}</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4 ">
          <Button
            variant="error"
            className={showCancel ? "sm:flex-1" : "sm:min-w-40"}
            onClick={accept}>
            {options?.acceptLabel || "Yes"}
          </Button>
          {showCancel && (
            <Button variant="neutral" className="sm:flex-1" onClick={cancel}>
              {options?.cancelLabel || "No"}
            </Button>
          )}
        </div>
      </div>
    </dialog>
  )
}

export default NotificationModal
