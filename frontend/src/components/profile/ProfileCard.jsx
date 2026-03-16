import React, { useEffect } from "react";
import Card from "../landingPage/Card";
import Button from "../buttons/Button";
import UserSVG from "../svg/UserSVG";
import EmailSVG from "../svg/EmailSVG";
import LockSVG from "../svg/LockSVG";
import { useForm, FormProvider } from "react-hook-form";
import { FormField } from "@/components/forms/FormField";
import { useSession } from "@/providers/SessionProvider";
import { useNotification } from "@/providers/NotificationProvider";
import { useLocale } from "@/providers/LocaleProvider";

const ProfileCard = () => {
  const { user, getAccessToken, getUserData, setUser } = useSession();
  const { addNotification } = useNotification();
  const { t } = useLocale();

  const methods = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const { reset, handleSubmit, register, watch } = methods;

  useEffect(() => {
    reset({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
  }, [user]);

  const onSubmit = async (data) => {
    if (data.password && data.password !== data.confirmPassword) {
      addNotification(t ? t("general.form.password.match") : "Passwords must match", "error");
      return;
    }

    const body = { username: data.username, email: data.email };
    if (data.password) body.password = data.password;

    try {
      const accessToken = getAccessToken && getAccessToken();

      const res = await fetch("/api/v1/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (json?.code) throw new Error(json.code);

      addNotification(t ? t("message.success.USER_UPDATED") : "Profile updated", "success");

      if (getUserData) {
        const fresh = await getUserData();
        if (fresh && setUser) setUser(fresh);
      }

      reset({ ...data, password: "", confirmPassword: "" });
    } catch (err) {
      addNotification(t ? t("message.error.update_profile") : "Error updating profile", "error");
    }
  };

  return (
    <Card className="py-6 px-6 border-0">
      <h2 className="flex items-center gap-2 text-2xl">
        <UserSVG />
        {t ? t("general.profile.profileCard.title") : "Profile Settings"}
      </h2>
      <p className="text-1lg">{t ? t("general.profile.profileCard.description") : "Manage your account settings and preferences"}</p>

      <div className="mt-1">
        <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  name="username"
                  type="text"
                  label={t ? t("general.form.username.label") : "Username"}
                  placeholder={t ? t("general.form.username.placeholder") : "Your username"}
                  rules={{ required: t ? t("general.form.username.required") : "Required" }}
                />

                <FormField
                  name="email"
                  type="email"
                  label={t ? t("general.form.email.label") : "Email"}
                  placeholder={t ? t("general.form.email.placeholder") : "you@example.com"}
                  rules={{
                    required: t ? t("general.form.email.required") : "Required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t ? t("general.form.email.pattern") : "Invalid email" },
                  }}
                />

                <FormField
                  name="password"
                  type="password"
                  label={t ? t("general.form.password.label") : "Password"}
                  placeholder={t ? t("general.form.password.placeholder") : "New password"}
                  rules={{ pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/, message: t ? t("general.form.password.pattern") : "Invalid password" } }}
                />

                <FormField
                  name="confirmPassword"
                  type="password"
                  label={t ? t("general.form.confirmPassword.label") : "Confirm Password"}
                  placeholder={t ? t("general.form.confirmPassword.placeholder") : "Confirm new password"}
                  rules={{ validate: (val) => (watch("password") ? val === watch("password") || (t ? t("general.form.confirmPassword.match") : "Passwords must match") : true) }}
                />

                <div className="form-control mt-2">
                  <Button className="w-full">{t ? t("general.form.buttons.update") : "Update Profile"}</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
