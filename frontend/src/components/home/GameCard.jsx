import React from "react"
import Button from "@/components/buttons/Button"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"

const GameCard = ({ game }) => {
  const { t } = useLocale()
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(game.route)}
      className="group aspect-7/5 rounded-xl relative overflow-hidden border border-secondary/20 hover:scale-[102%] transition-transform duration-300"
    >
      <img
        src={game.img}
        alt={game.game}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      <div className="absolute inset-0 bg-black/10 z-0" />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/90 via-black/50 to-transparent z-10" />

      <div className="absolute top-4 left-2 flex flex-col gap-1 z-30">
        {game.badges.map((badge, i) => (
          <span key={i} className="scale-[0.9]">
            {badge}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/60  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <Button>{t("pages.home.cards.playNow")}</Button>
      </div>

      <div className="absolute bottom-4 left-4 z-30">
        <p className="text-lg font-semibold text-white">
          {t(`pages.home.cards.${game.game}.title`)}
        </p>

        <p className="text-sm text-white/70">{t(`pages.home.cards.${game.game}.description`)}</p>
      </div>
    </div>
  )
}

export default GameCard
