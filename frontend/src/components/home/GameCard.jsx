import React from "react"
import { useNavigate } from "react-router-dom"
import { useLocale } from "@/providers/LocaleProvider"
import Button from "../buttons/Button"

const GameCard = ({ title, description, image, route, badges = [] }) => {
  const { t } = useLocale()
  const navigate = useNavigate()

  return (
    <div className="card bg-base-100 max-w-84 shadow-sm overflow-hidden group">
      <figure className="relative h-52">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-2 z-10">
          {badges.map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </div>

        <div
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center"
          onClick={() => navigate(route)}>
          <Button variant="primary">{t("pages.home.cards.playNow")}</Button>
        </div>
      </figure>

      <div className="card-body transition duration-300 group-hover:opacity-70">
        <h2 className="card-title">{t(title)}</h2>
        <p>{t(description)}</p>
      </div>
    </div>
  )
}

export default GameCard
