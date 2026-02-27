import React from "react";
import Button from "../button/Button";

const HeroContent = () => {
  return (
    <div className="relative z-10 py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Bienvenido a<span className="text-primary">Pakito's Gambling</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          La mejor experiencia de casino online con cientos de juegos
          emocionantes, bonos increíbles y la oportunidad de ganar grandes
          premios. Únete a nuestra comunidad de ganadores hoy mismo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {/*BUTTONS THAT WE HAVE TO CHANGE*/}
          <Button
            variant="primary"
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 rounded-box"
          >
            Unirse
          </Button>

          <Button
            size="lg"
            variant="neutral"
            className="rounded-box px-8 py-6 border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
          >
            Ver Juegos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
