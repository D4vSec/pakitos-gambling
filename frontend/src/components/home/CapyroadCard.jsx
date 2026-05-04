import React from "react"
import Button from "../buttons/Button"
import Card from "../landingPage/Card"
import Badge from "../badges/Badges"
import SparkleSVG from "../svg/SparkleSVG"
import CrownSVG from "../svg/CrownSVG"
import capybaraImg from "@/assets/capybara_packet_tracer.jpeg"
import { useNavigate } from "react-router-dom"
import { useLocale } from "@/providers/LocaleProvider"

const CapyroadCard = () => {
  const { t } = useLocale()
  const navigate = useNavigate()
  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
      <div className="mb-6 border-b-2 pb-3 text-primary">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-primary">
          <CrownSVG />
          {t("pages.home.cards.capyroad.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="group overflow-hidden bg-card/50 border border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl">
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src={capybaraImg}
              alt="Capyroad"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute top-2 left-2 flex flex-col gap-2 z-5">
              <Badge variant="primary" svg={<SparkleSVG className="w-4 h-4" />}>
                NEW
              </Badge>
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
                onClick={() => navigate("/capyroad")}>
                {t("pages.home.cards.playNow")}
              </Button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold">Capyroad</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("pages.home.cards.capyroad.description")}
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default CapyroadCard
