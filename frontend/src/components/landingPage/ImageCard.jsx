import React from "react"

const ImageCard = ({ title, text, img, className = "", gradient }) => {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        ${className}
      `}
    >
      {/* Imagen */}
      <img
        src={img}
        alt={title}
        loading="lazy"
        decoding="async"
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
      <div className="absolute inset-0 flex items-end p-6 md:p-8 xs:aspect-1/1 aspect-auto">
        <div className="max-w-xl flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-white/90 text-sm md:text-base">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default ImageCard
