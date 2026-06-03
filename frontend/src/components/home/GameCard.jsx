import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"
import { IconTriangle } from "@tabler/icons-react"

const GameCard = ({ game }) => {
  const { t } = useLocale()
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(game.route)}
      className="group relative aspect-6/5 cursor-pointer overflow-hidden rounded-[1.35rem] border border-white/10 bg-neutral shadow-[0_18px_45px_rgba(0,0,0,0.24)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_28px_80px_rgba(0,0,0,0.38)] sm:aspect-7/5 sm:rounded-[1.55rem] lg:rounded-[1.75rem]">
      <img
        src={game.img}
        alt={game.game}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/30" />
      <div className="absolute -right-8 top-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute left-0 top-0 h-full w-full bg-linear-to-tr from-primary/12 via-transparent to-secondary/6 opacity-60" />

      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/95 via-black/68 to-transparent sm:h-32 lg:h-36" />

      <div className="absolute left-3 top-3 z-30 flex max-w-[70%] flex-wrap gap-1.5 pr-2 sm:left-4 sm:top-4 sm:gap-2 sm:pr-4">
        {game.badges.map((badge, i) => (
          <span
            key={i}
            className="origin-top-left scale-[0.82] drop-shadow-sm sm:scale-[0.9]">
            {badge}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button svg={<IconTriangle className="rotate-90 scale-75 stroke-2" />}>
          {t("pages.home.cards.playNow")}
        </Button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-4 sm:px-6 sm:pb-6">
        <p className="text-xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] sm:text-lg lg:text-xl">
          {t(`pages.home.cards.${game.game}.title`)}
        </p>

        <p className="mt-1 line-clamp-2 max-w-[92%] text-xs leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-sm">
          {t(`pages.home.cards.${game.game}.description`)}
        </p>
      </div>
    </article>
  )
}

export default GameCard
