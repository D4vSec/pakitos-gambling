import React from "react"

const ColorTest = () => {
    const colors = [
        "primary",
        "secondary",
        "accent",
        "neutral",
        "info",
        "success",
        "warning",
        "error",
        "base-100",
        "base-200",
        "base-300",
    ]

    const colorClasses = {
        primary: "bg-primary text-primary-content",
        secondary: "bg-secondary text-secondary-content",
        accent: "bg-accent text-accent-content",
        neutral: "bg-neutral text-neutral-content",
        info: "bg-info text-info-content",
        success: "bg-success text-success-content",
        warning: "bg-warning text-warning-content",
        error: "bg-error text-error-content",
        "base-100": "bg-base-100 text-base-content",
        "base-200": "bg-base-200 text-base-content",
        "base-300": "bg-base-300 text-base-content",
    }

    return (
        <div className="p-8 space-y-4 ">
            <h1 className="text-3xl font-bold text-base-content">DaisyUI Theme Colors</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colors.map((color) => (
                    <div key={color} className={`p-6 rounded-box shadow-lg ${colorClasses[color]}`}>
                        {color}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ColorTest
