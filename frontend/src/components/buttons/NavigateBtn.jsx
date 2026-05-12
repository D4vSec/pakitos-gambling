import React from "react"
import Button from "./Button"
import { useNavigate } from "react-router-dom"

const RedirectBtn = ({
  children,
  variant = "primary",
  className = "",
  size = "md",
  onClick,
  svg,
  disabled = false,
  to,
}) => {
  const navigate = useNavigate()
  return (
    <Button
      variant={variant}
      className={className}
      size={size}
      onClick={() => (to ? navigate(to) : onClick)}
      svg={svg}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}

export default RedirectBtn
