import React from "react"
import chipValues from "./chipValues"

const Chip = ({ value }) => {
    const chip = chipValues.find((c) => c.value === value) || chipValues[0]
    const { color, edgeColor, shadowColor, idSuffix } = chip

    const edgeId = `edgeGradient-${idSuffix}`
    const topId = `topGradient-${idSuffix}`
    const shadowId = `shadow-${idSuffix}`

    return (
        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={edgeId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={edgeColor} />
                    <stop offset="50%" stopColor={edgeColor} />
                    <stop offset="100%" stopColor={edgeColor} />
                </linearGradient>
                <radialGradient id={topId} cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} />
                </radialGradient>
                <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow
                        dx="0"
                        dy="3"
                        stdDeviation="3"
                        floodColor={shadowColor}
                        floodOpacity="0.35"
                    />
                </filter>
            </defs>

            <ellipse cx="50" cy="55" rx="45" ry="45" fill={`url(#${edgeId})`} />
            <circle cx="50" cy="48" r="45" fill={`url(#${topId})`} filter={`url(#${shadowId})`} />

            <g fill="#ffffff" transform="translate(50 48)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <rect
                        key={i}
                        x="-1.5"
                        y="-42.5"
                        width="3.5"
                        height="10.5"
                        rx="1"
                        transform={`rotate(${angle})`}
                    />
                ))}
            </g>

            <text
                x="50"
                y="52"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="28"
                fontFamily="Arial"
                fill="#ffffff"
                fontWeight="bold"
            >
                {chip.displayValue || chip.value}
            </text>
        </svg>
    )
}

export default Chip
