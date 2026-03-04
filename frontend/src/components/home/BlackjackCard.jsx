import React from "react";
import Button from "../buttons/Button";
import Card from "../landingPage/Card";
import BlackjackSVG from "../svg/BlackjackSVG";
import { useLocale } from "@/providers/LocaleProvider";

const BlackjackCard = () => {
  const { t } = useLocale();
  return (
    <section className="relative max-w-6xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
      <div className="mb-6 border-b-2 pb-3 text-primary">
        <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-primary">
          <BlackjackSVG className="w-6 h-6 text-primary" />
          {t("general.home.blackjack.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="group overflow-hidden bg-card/50 border border-border hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl">
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLnOC75AUFSS57RgDWsTDTdqgHsQ-CIuPAGA&s"
              alt="Blackjack"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition">
                {t("general.home.playNow")}
              </Button>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-semibold">Blackjack</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("general.home.blackjack.description")}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default BlackjackCard;
