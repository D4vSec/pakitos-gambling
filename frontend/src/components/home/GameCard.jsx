import React from "react"
import { useNavigate } from "react-router-dom"

const GameCard = ({ title, description, image, route, badges = [] }) => {
  const navigate = useNavigate()

  return (
    <div className="card bg-base-100 max-w-84 shadow-sm overflow-hidden group">
      {/* IMAGE */}
      <figure className="relative h-52">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* BADGES */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
          {badges.map((b, i) => (
            <span key={i} className={`badge badge-${b.variant}`}>
              {b?.svg}
              {b.label}
            </span>
          ))}
        </div>

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
          <button className="btn btn-primary" onClick={() => navigate(route)}>
            Play Now
          </button>
        </div>
      </figure>

      {/* BODY */}
      <div className="card-body transition duration-300 group-hover:opacity-70">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default GameCard
