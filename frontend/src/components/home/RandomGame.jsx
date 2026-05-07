import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import React from "react"
import { useNavigate } from "react-router-dom"

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
      <div className="group relative h-32 md:h-36 rounded-3xl overflow-hidden border border-base-300 bg-base-200 px-6 flex items-center justify-between hover:scale-[101%] hover:border-primary/40 transition-all duration-300">
        {/* Red Glow (primary accent) */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-0 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
        {/* Subtle particles */}
        <div className="absolute top-6 right-32 w-2 h-2 rounded-full bg-primary/60" />
        <div className="absolute bottom-8 right-52 w-1.5 h-1.5 rounded-full bg-primary/50" />
        {/* Soft overlay for contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,--theme(--color-base-100/60),--theme(--color-base-200/40)_60%,--theme(--color-base-300/70)_100%)]" />{" "}
        {/* Left Content */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-3xl shadow-md backdrop-blur-sm">
            🎲
          </div>

          <div>
            <h4 className="text-xl font-bold text-base-content">
              {t("pages.home.randomGame.title")}
            </h4>

            <p className="text-sm md:text-base text-base-content/70">
              {t("pages.home.randomGame.description")}
            </p>
          </div>
        </div>
        {/* CTA */}
        <Button className="z-20" onClick={() => handleRandomGame()}>
          {t("pages.home.randomGame.action")}
        </Button>
      </div>
    </section>
  )
}

export default RandomGame
