import React from "react"

const FeatureCard = ({ title, description, icon, className = "" }) => {
  return (
    <div
      className={`
        group relative overflow-hidden
        p-6 rounded-xl
        border border-border
        bg-background
        transition-all duration-300
        hover:border-primary
        hover:shadow-lg hover:shadow-primary/10
        ${className}
      `}>
      {/* SVG fondo */}
      <div
        className="
          absolute opacity-45
          scale-750
          top-16 left-[90%]
          rotate-12
          transition-colors duration-300
          text-muted-foreground
          group-hover:text-primary
          pointer-events-none
        ">
        {icon}
      </div>

      {/* contenido */}
      <div className="relative z-10 flex flex-col ">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm max-w-[75%]">
          {description}
        </p>
      </div>
    </div>
  )
}

export default FeatureCard
