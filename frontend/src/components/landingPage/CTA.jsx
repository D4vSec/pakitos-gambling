import React from "react"
import Button from "../buttons/Button"

const CTA = () => {
    return (
        <section className="relative overflow-hidden rounded-xl">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    ¿Listo para comenzar tu aventura?
                </h2>
                <p className="text-lg text-muted-foreground  mb-8 max-w-2xl mx-auto">
                    Únete a miles de jugadores que ya disfrutan de la mejor experiencia de casino
                    online. Obtén tu bono de bienvenida del 200% hoy mismo.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg">
                        Unirse ahora
                    </Button>
                    <Button variant="accent" size="lg">
                        Explorar juegos
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default CTA
