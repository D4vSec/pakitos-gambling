import React from "react";
import Card from "./Card";
import { useLocale } from "../../providers/LocaleProvider";

const Features = () => {
  const { t } = useLocale();

  const featureKeys = [1, 2, 3, 4, 5, 6];

  {/*THIS COMOPONENT NEED TO IMPROVE*/}
  return (
    <section className="mb-16">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {t("general.landingPage.features.title")}
        </h2>
        <p className="text-lg text-muted-foreground text-center py-4">
          {t("general.landingPage.features.text")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {featureKeys.map((num) => {
          const title = t(`general.landingPage.features.item${num}_title`);
          const description = t(
            `general.landingPage.features.item${num}_description`
          );

          return (
            <Card
              key={num}
              className="p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                {/*ADD ICON HERE*/}
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Features;