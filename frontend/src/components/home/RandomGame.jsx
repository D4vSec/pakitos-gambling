import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import React from "react"
import { useNavigate } from "react-router-dom"
import { IconDice5 } from "@tabler/icons-react"

const RandomGame = () => {
  const { t } = useLocale()
  const navigate = useNavigate()

  const routes = [
    "/blackjack",
    "/roulette00",
    "/roulette0",
    "/capyroad",
    "/slots",
    "/slots3x5",
    "/slots5x5",
  ]

  const handleRandomGame = () => {
    const num = Math.floor(Math.random() * routes.length)
    navigate(routes[num])
  }
  return (
    <section className="w-full">
      <div className="group relative h-auto sm:h-32 md:h-36 rounded-3xl overflow-hidden border border-primary bg-base-200 px-6 py-4 sm:py-0 flex flex-col sm:flex-row items-center  justify-between gap-4 hover:scale-[101%]  transition-all duration-300">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-0 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute top-6 right-32 w-2 h-2 rounded-full bg-primary/60" />
        <div className="absolute bottom-8 right-52 w-1.5 h-1.5 rounded-full bg-primary/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,--theme(--color-base-100/60),--theme(--color-base-200/40)_60%,--theme(--color-base-300/70)_100%)]" />
        {/* Left Content */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-3xl shadow-md backdrop-blur-sm">
            <IconDice5 className="sm:w-8 sm:h-8" />
          </div>

          <div>
            <h4 className="text-lg md:text-xl font-bold text-base-content">
              {t("pages.home.randomGame.title")}
            </h4>

            <p className="text-xs sm:text-sm md:text-base text-base-content/70">
              {t("pages.home.randomGame.description")}
            </p>
          </div>
        </div>
        <Button className="z-20 w-full sm:w-auto" onClick={() => handleRandomGame()}>
          {t("pages.home.randomGame.action")}
        </Button>
      </div>
    </section>
  )
}

export default RandomGame
