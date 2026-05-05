import React from "react"

const variantMap = {
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  neutral: "badge-neutral",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
}

const sizeMap = {
  sm: "badge-sm",
  md: "badge-md",
  lg: "badge-lg",
}

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  svg,
}) => {
  const safeVariant = variantMap[variant] || variantMap.primary
  const safeSize = sizeMap[size] || sizeMap.md

  return (
    <div
      className={`badge ${safeVariant} ${safeSize} ${className} flex items-center gap-1 rounded-lg`}>
      {svg}
      {children}
    </div>
  )
}

export default Badge
