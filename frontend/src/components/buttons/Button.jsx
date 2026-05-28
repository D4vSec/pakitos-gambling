import React from "react"

const variantMap = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  neutral: "btn-neutral",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
  ghost: "btn-ghost",
  link: "btn-link",
}

const sizeMap = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-md md:btn-lg",
  xl: "btn-lg md:btn-xl",
}

const joinClassNames = (...parts) =>
  parts.filter(Boolean).join(" ")

const Button = ({
  children,
  variant = "primary",
  className = "",
  size = "md",
  type,
  onClick,
  svg,
  disabled = false,
  modifiers = [],
  unstyled = false,
  ...rest
}) => {
  const safeVariant = variantMap[variant] || variantMap.primary
  const safeSize = sizeMap[size] || sizeMap.md
  const modifierClassName = Array.isArray(modifiers)
    ? modifiers.join(" ")
    : modifiers

  return (
    <button
      type={type}
      className={
        unstyled
          ? className
          : joinClassNames(
              "btn flex items-center justify-center gap-2 rounded-lg font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition-all duration-300",
              safeVariant,
              safeSize,
              modifierClassName,
              className,
            )
      }
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {svg}
      {children}
    </button>
  )
}

export default Button
