import React from "react"
import Card from "./Card"
import { useLocale } from "@/providers/LocaleProvider"

const ImagesGrid = () => {
  const { t } = useLocale()

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("pages.landingPage.imagesGrid.title")}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("pages.landingPage.imagesGrid.text")}
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

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t("pages.landingPage.imagesGrid.items.win.title")}
                </h3>
                <p className="text-lg text-white/90 mb-6">
                  {t("pages.landingPage.imagesGrid.items.win.text")}
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
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t("pages.landingPage.imagesGrid.items.premium.title")}
                </h3>
                <p className="text-lg text-white/90 mb-6">
                  {t("pages.landingPage.imagesGrid.items.premium.text")}
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
            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent">
              <div className="absolute inset-0 flex items-center md:block">
                <div className="p-8 md:p-12 max-w-2xl md:absolute md:bottom-0">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {t("pages.landingPage.imagesGrid.items.mobile.title")}
                  </h3>
                  <p className="text-lg text-white/90 mb-6">
                    {t("pages.landingPage.imagesGrid.items.mobile.text")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default ImagesGrid
