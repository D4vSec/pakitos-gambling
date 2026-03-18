import React from "react";
import ProfileCard from "@/components/profile/ProfileCard";
import { useLocale } from "@/providers/LocaleProvider";


const Profile = () => {
  const { t } = useLocale();
  return (
    <div className="max-w-4xl mx-auto space-y-5 py-5">
      <div>
        <h1 className="text-3xl font-bold">{t("general.profile.title")}</h1>
        <p className="text-muted-foreground">
          {t("general.profile.description")}
        </p>
      </div>

      {/* Profile Information Card */}
      <ProfileCard />
    </div>
  );
};

export default Profile;
