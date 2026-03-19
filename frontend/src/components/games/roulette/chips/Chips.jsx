import React from "react"
import Chip from "./Chip"
import chipValues from "./chipValues"

const Chips = () => {
    return (
        <>
            {chipValues.map((chip) => (
                <Chip key={chip.idSuffix} {...chip} />
            ))}
        </>
    )
}

export default Chips
