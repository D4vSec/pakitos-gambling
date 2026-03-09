import React from "react"
import "./RouletteTable.css"

const RouletteTable = () => {
    const cells = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
        13: "col 1",
        14: 13,
        15: 14,
        16: 15,
        17: 16,
        18: 17,
        19: 18,
        20: 19,
        21: 20,
        22: 21,
        23: 22,
        24: 23,
        25: 24,
        26: "col 2",
        27: 25,
        28: 26,
        29: 27,
        30: 28,
        31: 29,
        32: 30,
        33: 31,
        34: 32,
        35: 33,
        36: 34,
        37: 35,
        38: 36,
        39: "col 3",
        40: "1 to 12",
        41: "13 to 24",
        42: "25 to 36",
        43: "1 to 18",
        44: "even",
        45: "red",
        46: "black",
        47: "odd",
        48: "19 to 36",
    }
    return (
        <div className="grid grid-cols-14 grid-rows-5 gap-1 col-span-3 w-full h-full text-black">
            {Object.keys(cells).map((k) => (
                <div key={k} className={`div${k} bg-secondary flex justify-center items-center`}>
                    {cells[k]}
                </div>
            ))}
        </div>
    )
}

export default RouletteTable
