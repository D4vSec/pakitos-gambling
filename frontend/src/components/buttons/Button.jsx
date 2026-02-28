import React from "react"

const variants = [
    "primary",
    "secondary",
    "accent",
    "neutral",
    "info",
    "success",
    "warning",
    "error",
    "ghost",
]

const Button = ({ children, variant = "primary", className, size, onClick, svg }) => {
    const safeVariant = variants.includes(variant) ? variant : "primary"
    return (
        <button
            className={`btn btn-${safeVariant} ${size && `btn-${size}`} ${className}`}
            onClick={() => onClick()}
        >
            {svg}
            {children}
        </button>
    )
}

export default Button
