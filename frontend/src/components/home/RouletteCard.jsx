import React from "react";
import Card from "../landingPage/Card";
import Button from "../buttons/Button";
import LemonSVG from "../svg/LemonSVG";
import { useLocale } from "@/providers/LocaleProvider";
import Badge from "./Badges";
import CrownSVG from "../svg/CrownSVG";
import DolarSVG from "../svg/DolarSVG";
import SparkleSVG from "../svg/SparkleSVG";
import { useNavigate } from "react-router-dom";

const RouletteCard = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  return (
    <section className=" max-w-6xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
      <div className="mb-6 border-b-2 pb-3 text-primary">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-primary">
          <LemonSVG className="w-6 h-6 text-primary" />
          {t("general.home.roulette.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="relative group overflow-hidden bg-card/50 border border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl">
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src="https://thumbs.dreamstime.com/b/rueda-de-ruleta-americana-y-europea-58049629.jpg"
              alt="Roulette"
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
              <Button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
                onClick={() => navigate("/roulette")}
              >
                {t("general.home.playNow")}
              </Button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold">
              {t("general.home.roulette.american.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("general.home.roulette.american.description")}
            </p>
          </div>
        </Card>

        <Card className="group overflow-hidden bg-card/50 border border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl">
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src="data:image/jpeg;base64,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"
              alt="Roulette"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 z-5">
              <Badge variant="warning" svg={<DolarSVG className="w-4 h-4" />}>
                1.1M
              </Badge>
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
                onClick={() => navigate("/roulette")}
              >
                {t("general.home.playNow")}
              </Button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold">
              {t("general.home.roulette.classic.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("general.home.roulette.classic.description")}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default RouletteCard;
