import React, { useState } from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { useSession } from "@/providers/SessionProvider"
import GradientBg from "@/components/layout/GradientBg"
import { IconBan, IconHome } from "@tabler/icons-react"
import NavigationBtn from "@/components/buttons/NavigationBtn"

const ErrorDigit = ({ number }) => (
  <div className="relative flex h-36 w-20 items-center justify-center sm:h-40 sm:w-24 md:h-48 md:w-28">
    <span className="absolute translate-x-1.5 translate-y-1.5 text-[86px] font-black text-accent-content/50 blur-2 sm:text-[104px] md:text-9xl">
      {number}
    </span>
    <span className="relative text-[86px] font-black text-base-content drop-shadow-[0_0_24px_rgba(0,0,0,0.45)] sm:text-[104px] md:text-9xl">
      {number}
    </span>
  </div>
)

const ErrorBan = () => (
  <div className="relative flex h-36 w-20 items-center justify-center sm:h-40 sm:w-24 md:h-48 md:w-28">
    <IconBan
      className="absolute h-20 w-20 translate-x-1.5 translate-y-1.5 text-accent-content/50 blur-2 sm:h-24 sm:w-24 md:h-28 md:w-28"
      stroke={2.25}
    />
    <IconBan
      className="relative h-24 w-24 text-base-content drop-shadow-[0_0_24px_rgba(0,0,0,0.45)] sm:h-28 sm:w-28 md:h-32 md:w-32"
      stroke={2.25}
    />
  </div>
)

const Error = () => {
  const { t } = useLocale()
  const { addBalance, isLogged } = useSession()
  const [clicked, setClicked] = useState(false)

  const handleClick = async () => {
    if (clicked || !isLogged) return
    setClicked(true)
    addBalance(10000)
  }

  return (
    <GradientBg>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center">
          <ErrorDigit number={4} />
          <ErrorBan />
          <ErrorDigit number={4} />
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <h3 className="max-w-lg text-center text-md md:max-w-2xl md:text-lg">
            {t("pages.error.message.beforeHighlight")}
            <span
              className="transition-all duration-200 hover:font-bold hover:text-accent"
              onClick={() => handleClick()}
            >
              {" "}
              {t("pages.error.message.highlight")}{" "}
            </span>
            {t("pages.error.message.afterHighlight")}
          </h3>

          <NavigationBtn
            size="lg"
            to={isLogged ? "/home" : "/"}
            svg={<IconHome />}
            className="w-fit shadow-lg"
          >
            {t("pages.error.cta")}
          </NavigationBtn>
        </div>
      </div>
    </GradientBg>
  )
}

export default Error
