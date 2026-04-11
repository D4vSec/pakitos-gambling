import React from "react"
import GradientBg from "./layout/GradientBg"
import { PacmanLoader } from "react-spinners"
import { useLocale } from "@/providers/LocaleProvider"

const Loading = () => {
    const { t } = useLocale()
    return (
        <div className="w-full h-full">
            <GradientBg>
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <PacmanLoader color="#fff" size={40} />
                </div>
            </GradientBg>
        </div>
    )
}

export default Loading
