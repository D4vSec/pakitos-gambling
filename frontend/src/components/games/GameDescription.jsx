import React, { useState } from "react"

const GameDescription = ({ title, children }) => {
    const [open, setOpen] = useState(false)
    return (
        <div
            className={`collapse collapse-arrow bg-base-100 border border-base-300 ${open ? "collapse-open" : ""}`}
            onClick={() => setOpen(!open)}
        >
            <div className="collapse-title font-semibold">{title}</div>
            <div className="collapse-content text-sm">{children}</div>
        </div>
    )
}

export default GameDescription
