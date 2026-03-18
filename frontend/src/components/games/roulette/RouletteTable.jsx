import React from "react"
import "./RouletteTable.css"

const RouletteTable = () => {
    const cells = {
        37: "col 1",
        38: "col 2",
        39: "col 3",
        40: "1st doz",
        41: "2nd doz",
        42: "3rd doz",
        43: "1 to 18",
        44: "even",
        45: "red",
        46: "black",
        47: "odd",
        48: "19 to 36",
    }

    const numbers = Array.from({ length: 37 }, (_, i) => i)

    return (
        <div className="col-span-3 w-full h-full">
            <div className="grid grid-cols-28 grid-rows-10 gap-1 w-full h-full text-black z-10">
                {/* NUMEROS */}
                {numbers.map((num) => (
                    <div
                        key={num}
                        className={`div${num} bg-secondary flex justify-center items-center`}
                    >
                        {num}
                    </div>
                ))}

                {/* columnas */}
                {[37, 38, 39].map((i) => (
                    <div
                        key={i}
                        className={`div${i} bg-secondary flex justify-center items-center`}
                    >
                        {cells[i]}
                    </div>
                ))}

                {/* docenas */}
                {[40, 41, 42].map((i) => (
                    <div
                        key={i}
                        className={`div${i} bg-secondary flex justify-center items-center`}
                    >
                        {cells[i]}
                    </div>
                ))}

                {/* exteriores */}
                {[43, 44, 45, 46, 47, 48].map((i) => (
                    <div
                        key={i}
                        className={`div${i} bg-secondary flex justify-center items-center`}
                    >
                        {cells[i]}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RouletteTable
