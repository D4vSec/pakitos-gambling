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
}

const sizeMap = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
}

const Button = ({ children, variant = "primary", className = "", size = "md", onClick, svg }) => {
    const safeVariant = variantMap[variant] || variantMap.primary
    const safeSize = sizeMap[size] || sizeMap.md

    return (
        <button className={`btn ${safeVariant} ${safeSize} ${className}`} onClick={onClick}>
            {svg}
            {children}
        </button>
    )
}
export default Button
