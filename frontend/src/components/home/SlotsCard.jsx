import React from "react";
import Card from "../landingPage/Card";
import Button from "../buttons/Button";
import CoinsSVG from "../svg/CoinsSVG";
import { useLocale } from "@/providers/LocaleProvider";
import Badge from "./Badges";
import CrownSVG from "../svg/CrownSVG";
import SparkleSVG from "../svg/SparkleSVG";
import { useNavigate } from "react-router-dom";

const SlotsCard = () => {
  const { t } = useLocale();
  const navigate = useNavigate()
  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
      <div className="mb-6 border-b-2 pb-3 text-primary">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-primary">
          <CoinsSVG className="w-6 h-6 text-primary" />
          {t("general.home.slots.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/*SLOT FOR JUAN CARLOS*/}
        <Card className="group overflow-hidden bg-card/50 border border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl">
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrNQxbcMUArp30RgD-TMUfwXwbtOulr1KpRQ&s"
              alt="Star Wars Slot"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-2 z-5">
              <Badge variant="success" svg={<CrownSVG className="w-4 h-4" />}>
                POPULAR
              </Badge>
              <Badge variant="primary" svg={<SparkleSVG className="w-4 h-4" />}>
                NEW
              </Badge>
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
              onClick={() => navigate("/slots")}
              >
                {t("general.home.playNow")}
              </Button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold">
              {t("general.home.slots.starwars.title")} (3×3)
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("general.home.slots.starwars.description")}
            </p>
          </div>
        </Card>
        {/*SLOT FOR ROSA*/}
        <Card className="group overflow-hidden bg-card/50 border border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl">
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg?t=1754692865"
              alt="Stardew Valley Slot"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute top-2 left-2 flex flex-col gap-2 z-5">
              <Badge variant="success" svg={<CrownSVG className="w-4 h-4" />}>
                POPULAR
              </Badge>
              <Badge variant="primary" svg={<SparkleSVG className="w-4 h-4" />}>
                NEW
              </Badge>
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
              onClick={() => navigate("/slots3x5")}
              >
                {t("general.home.playNow")}
              </Button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold">
              {t("general.home.slots.stardewValley.title")} (3×5)
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("general.home.slots.stardewValley.description")}
            </p>
          </div>
        </Card>
        {/*SLOT FOR MIGUEL*/}
        <Card className="group overflow-hidden bg-card/50 border border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl">
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfW2FK3WygWTRlHntydaHZ27Gg0P88cms7ow&s"
              alt="Beer Slot"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute top-2 left-2 flex flex-col gap-2 z-5">
              <Badge variant="success" svg={<CrownSVG className="w-4 h-4" />}>
                POPULAR
              </Badge>
              <Badge variant="primary" svg={<SparkleSVG className="w-4 h-4" />}>
                NEW
              </Badge>
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
                onClick={() => navigate("/slots5x5")}
              >
                {t("general.home.playNow")}
              </Button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold">
              {t("general.home.slots.beer.title")} (5×5)
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("general.home.slots.beer.description")}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SlotsCard;
