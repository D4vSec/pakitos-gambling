import React from "react";
import Card from "./Card";

const ImagesGrid = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Experiencia de Juego Inigualable con Pakito's Gambling
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Disfruta de la mejor experiencia de juego con gráficos impresionantes
          y una interfaz intuitiva diseñada para tu entretenimiento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden group">
          <div className="relative h-64 md:h-80">
            <img
              src="https://images.unsplash.com/photo-1688873157896-432c9a44eaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBjZWxlYnJhdGluZyUyMHdpbm5pbmclMjBjYXNpbm98ZW58MXx8fHwxNzcyMTIzNDY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="imagen prueba"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Celebra Tus Victorias
                </h3>
                <p className="text-lg text-white/90 mb-6">
                  Gana grandes premios y disfruta cada momento
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden group">
          <div className="relative h-64 md:h-80">
            <img
              src="https://images.unsplash.com/photo-1688873157896-432c9a44eaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBjZWxlYnJhdGluZyUyMHdpbm5pbmclMjBjYXNpbm98ZW58MXx8fHwxNzcyMTIzNDY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="imagen prueba"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ambiente premium
                </h3>
                <p className="text-lg text-white/90 mb-6">
                  Disfruta de un ambiente de casino auténtico con gráficos
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden group md:col-span-2">
          <div className="relative h-64 md:h-96">
            <img
              src="https://images.unsplash.com/photo-1688873157896-432c9a44eaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBjZWxlYnJhdGluZyUyMHdpbm5pbmclMjBjYXNpbm98ZW58MXx8fHwxNzcyMTIzNDY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Juega en Móvil"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="p-8 md:p-12 max-w-2xl">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Juega Donde Quieras
                </h3>
                <p className="text-lg text-white/90 mb-6">
                  Accede a todos tus juegos favoritos desde cualquier
                  dispositivo. Diseño responsive para móvil, tablet y
                  escritorio.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ImagesGrid;
