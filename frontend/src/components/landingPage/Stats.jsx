import React from "react";
import Card from "./Card";

const Stats = () => {
  return (
    <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
      <Card className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
          100+
        </div>
        <div className="text-muted-foreground">Juegos</div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
          10K+
        </div>
        <div className="text-muted-foreground">Jugadores</div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
          24/7
        </div>
        <div className="text-muted-foreground">Soporte</div>
      </Card>
      <Card className="p-6 text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
          $1M+
        </div>
        <div className="text-muted-foreground">Premios</div>
      </Card>
    </section>
  );
};

export default Stats;
