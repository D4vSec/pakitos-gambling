import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "./Button"

const NavigationBtn = ({
  children,
  to,
  onClick,
  state,
  className = "",
  replace = false,
  type = "button",
  ...props
}) => {
  const navigate = useNavigate()

  const handleClick = (event) => {
    onClick?.(event)

    if (event?.defaultPrevented || !to) {
      return
    }

    if (typeof to === "number") {
      navigate(to)
      return
    }

    navigate(to, { replace, state })
  }

  return (
    <Button type={type} onClick={handleClick} className={className} {...props}>
      {children}
    </Button>
  )
}

export default NavigationBtn
