import React from "react"

const ImageCard = ({ title, text, img, className = "", gradient }) => {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        ${className}
      `}>
      {/* Imagen */}
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div
        className={`
          absolute inset-0
          ${gradient}
        `}
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <div className="max-w-xl">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {title}
          </h3>
          <p className="text-white/90 text-lg">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default ImageCard
