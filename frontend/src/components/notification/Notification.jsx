import React, { useEffect, useState } from "react"
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react"

const Notification = ({ notification }) => {
  const [show, setShow] = useState(false)

  const typeClasses = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  }

  const svg = {
    info: <IconInfoCircle />,
    success: <IconCircleCheck />,
    warning: <IconAlertTriangle />,
    error: <IconCircleX />,
  }

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`
        alert alert-horizontal
        ${typeClasses[notification.type] || ""}
        shadow-lg max-w-md
        transition-all duration-300 ease-out
        mt-4
        ${
          notification.leaving
            ? "opacity-0 -translate-y-4 scale-95"
            : show
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-4 scale-95"
        }
      `}
    >
      {svg[notification.type]}
      <span>{notification.message}</span>
    </div>
  )
}

export default Notification
