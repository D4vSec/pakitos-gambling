import React from "react";
import Button from "@/components/buttons/Button";
import { useLocale } from "@/providers/LocaleProvider";

const HeroContent = () => {
  const { t } = useLocale();
  return (
    <div className="relative py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {t("general.landingPage.heroContent.title")}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          {t("general.landingPage.heroContent.text")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" size="lg" className={"sm:btn-xl"}>
            {t("general.landingPage.heroContent.join")}
          </Button>
          <Button variant="accent" size="lg" className={"sm:btn-xl"}>
            {t("general.landingPage.heroContent.seeGames")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
