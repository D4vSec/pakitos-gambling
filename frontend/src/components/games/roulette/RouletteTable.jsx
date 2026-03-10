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
        13: 13,
        14: 14,
        15: 15,
        16: 16,
        17: 17,
        18: 18,
        19: 19,
        20: 20,
        21: 21,
        22: 22,
        23: 23,
        24: 24,
        25: 25,
        26: 26,
        27: 27,
        28: 28,
        29: 29,
        30: 30,
        31: 31,
        32: 32,
        33: 33,
        34: 34,
        35: 35,
        36: 36,
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

    return (
        <>
            <div className="col-span-3 w-full h-full">
                {/* GRID BASE */}
                <div className="grid grid-cols-14 grid-rows-5 gap-1 w-full h-full text-black z-10">
                    {/* SUBGRID NUMEROS */}
                    <div className="relative grid grid-cols-13 grid-rows-3 col-start-1 col-end-14 row-start-1 row-end-4 gap-1">
                        <div className="div0 bg-secondary flex justify-center items-center">
                            {cells[0]}
                        </div>
                        <div className="div1 bg-secondary flex justify-center items-center">
                            {cells[1]}
                        </div>
                        <div className="div2 bg-secondary flex justify-center items-center">
                            {cells[2]}
                        </div>
                        <div className="div3 bg-secondary flex justify-center items-center">
                            {cells[3]}
                        </div>
                        <div className="div4 bg-secondary flex justify-center items-center">
                            {cells[4]}
                        </div>
                        <div className="div5 bg-secondary flex justify-center items-center">
                            {cells[5]}
                        </div>
                        <div className="div6 bg-secondary flex justify-center items-center">
                            {cells[6]}
                        </div>
                        <div className="div7 bg-secondary flex justify-center items-center">
                            {cells[7]}
                        </div>
                        <div className="div8 bg-secondary flex justify-center items-center">
                            {cells[8]}
                        </div>
                        <div className="div9 bg-secondary flex justify-center items-center">
                            {cells[9]}
                        </div>
                        <div className="div10 bg-secondary flex justify-center items-center">
                            {cells[10]}
                        </div>
                        <div className="div11 bg-secondary flex justify-center items-center">
                            {cells[11]}
                        </div>
                        <div className="div12 bg-secondary flex justify-center items-center">
                            {cells[12]}
                        </div>

                        <div className="div13 bg-secondary flex justify-center items-center">
                            {cells[13]}
                        </div>
                        <div className="div14 bg-secondary flex justify-center items-center">
                            {cells[14]}
                        </div>
                        <div className="div15 bg-secondary flex justify-center items-center">
                            {cells[15]}
                        </div>
                        <div className="div16 bg-secondary flex justify-center items-center">
                            {cells[16]}
                        </div>
                        <div className="div17 bg-secondary flex justify-center items-center">
                            {cells[17]}
                        </div>
                        <div className="div18 bg-secondary flex justify-center items-center">
                            {cells[18]}
                        </div>
                        <div className="div19 bg-secondary flex justify-center items-center">
                            {cells[19]}
                        </div>
                        <div className="div20 bg-secondary flex justify-center items-center">
                            {cells[20]}
                        </div>
                        <div className="div21 bg-secondary flex justify-center items-center">
                            {cells[21]}
                        </div>
                        <div className="div22 bg-secondary flex justify-center items-center">
                            {cells[22]}
                        </div>
                        <div className="div23 bg-secondary flex justify-center items-center">
                            {cells[23]}
                        </div>
                        <div className="div24 bg-secondary flex justify-center items-center">
                            {cells[24]}
                        </div>

                        <div className="div25 bg-secondary flex justify-center items-center">
                            {cells[25]}
                        </div>
                        <div className="div26 bg-secondary flex justify-center items-center">
                            {cells[26]}
                        </div>
                        <div className="div27 bg-secondary flex justify-center items-center">
                            {cells[27]}
                        </div>
                        <div className="div28 bg-secondary flex justify-center items-center">
                            {cells[28]}
                        </div>
                        <div className="div29 bg-secondary flex justify-center items-center">
                            {cells[29]}
                        </div>
                        <div className="div30 bg-secondary flex justify-center items-center">
                            {cells[30]}
                        </div>
                        <div className="div31 bg-secondary flex justify-center items-center">
                            {cells[31]}
                        </div>
                        <div className="div32 bg-secondary flex justify-center items-center">
                            {cells[32]}
                        </div>
                        <div className="div33 bg-secondary flex justify-center items-center">
                            {cells[33]}
                        </div>
                        <div className="div34 bg-secondary flex justify-center items-center">
                            {cells[34]}
                        </div>
                        <div className="div35 bg-secondary flex justify-center items-center">
                            {cells[35]}
                        </div>
                        <div className="div36 bg-secondary flex justify-center items-center">
                            {cells[36]}
                        </div>
                        <div>
                            <div className="absolute inset-0 w-full h-full gap-2 grid grid-cols-23 grid-rows-7 z-20 pointer-events-auto">
                                {Array.from({ length: 64 }).map((_, k) => (
                                    <div key={k} className="bg-green-400/60"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* columnas */}
                    <div className="div37 bg-secondary flex justify-center items-center">
                        {cells[37]}
                    </div>
                    <div className="div38 bg-secondary flex justify-center items-center">
                        {cells[38]}
                    </div>
                    <div className="div39 bg-secondary flex justify-center items-center">
                        {cells[39]}
                    </div>

                    {/* docenas */}
                    <div className="div40 bg-secondary flex justify-center items-center">
                        {cells[40]}
                    </div>
                    <div className="div41 bg-secondary flex justify-center items-center">
                        {cells[41]}
                    </div>
                    <div className="div42 bg-secondary flex justify-center items-center">
                        {cells[42]}
                    </div>

                    {/* apuestas exteriores */}
                    <div className="div43 bg-secondary flex justify-center items-center">
                        {cells[43]}
                    </div>
                    <div className="div44 bg-secondary flex justify-center items-center">
                        {cells[44]}
                    </div>
                    <div className="div45 bg-secondary flex justify-center items-center">
                        {cells[45]}
                    </div>
                    <div className="div46 bg-secondary flex justify-center items-center">
                        {cells[46]}
                    </div>
                    <div className="div47 bg-secondary flex justify-center items-center">
                        {cells[47]}
                    </div>
                    <div className="div48 bg-secondary flex justify-center items-center">
                        {cells[48]}
                    </div>
                </div>

                {/* GRID OVERLAY */}
            </div>
        </>
    )
}

export default RouletteTable
