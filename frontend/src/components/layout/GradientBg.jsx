import React from "react"

const GradientBg = ({ children }) => {
    return (
        <div className="bg-linear-to-b from-primary to-base-200 min-h-full p-4 flex flex-col justify-center  items-center gap-6">
            {children}
        </div>
    )
}

export default GradientBg
