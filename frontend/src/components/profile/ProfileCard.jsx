import React, { useEffect, useState } from "react";
import Card from "../landingPage/Card";
import Button from "../buttons/Button";
import UserSVG from "../svg/UserSVG";
import { useForm, FormProvider } from "react-hook-form";
import { FormField } from "@/components/forms/FormField";
import { useSession } from "@/providers/SessionProvider";
import { useNotification } from "@/providers/NotificationProvider";
import { useLocale } from "@/providers/LocaleProvider";

//Lo dicho Nain si ves cosas raras o q no deberian de estar asi marcalo y lo cambio, o si quieres cambiarlo tu adelante,
//puta ia de mierda quiero beber y arrancarme el pelo, veras la tonteria de mierda q esta mal y por inutil de mierda q soy esta mal, me voy a comer :) 

const ProfileCard = () => {
  const { user, setUser, updateProfile, logout } = useSession();
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

  const [isEditing, setIsEditing] = useState(false);
  const { reset, handleSubmit, watch } = methods;

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
      addNotification(
        t ? t("general.form.password.match") : "Passwords must match",
        "error",
      );
      return;
    }

    const body = {
      username: data.username,
      email: data.email,
    };

    // Limpiar la contraseña de espacios y saltos de línea (en el login no lo cambiado pero creo que puede suponer un problema si ves q tal quitalo)
    const pwd = data.password?.trim().replace(/[\r\n]+/g, ""); 
    if (pwd) body.password = pwd;

    try {
      console.log("form", data);
      //El updateProfile lo cambio la mierda del copilot si ves que tal miralo. 
      const fresh = await updateProfile(body);

      if (pwd) {
        // Si se cambió la contraseña, forzar logout
        addNotification(
          t
            ? t("message.info.passwordChanged")
            : "Password changed successfully, please log in again",
          "info",
        );
        logout();
      } else if (fresh && setUser) {
        // Actualizar user si solo cambió username/email
        setUser(fresh);
      }

      reset({ ...data, password: "", confirmPassword: "" });
      setIsEditing(false);
    } catch (err) {
      console.error("Update profile failed", err);
    }
  };

  return (
    <Card className="py-6 px-6 border-0">
      <h2 className="flex items-center gap-2 text-2xl">
        <UserSVG />
        {t ? t("general.profile.profileCard.title") : "Profile Settings"}
      </h2>
      <p className="text-1lg">
        {t
          ? t("general.profile.profileCard.description")
          : "Manage your account settings and preferences"}
      </p>

      <div className="mt-1">
        <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body">
            {!isEditing ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t ? t("general.form.username.label") : "Username"}
                    </div>
                    <div className="text-lg font-medium">
                      {user?.username || "-"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t ? t("general.form.email.label") : "Email"}
                    </div>
                    <div className="text-lg font-medium">
                      {user?.email || "-"}
                    </div>
                  </div>
                </div>

                <div className="form-control mt-2">
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    {t ? t("general.form.buttons.update") : "Edit"}
                  </Button>
                </div>
              </div>
            ) : (
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    name="username"
                    type="text"
                    label={t ? t("general.form.username.label") : "Username"}
                    placeholder={
                      t
                        ? t("general.form.username.placeholder")
                        : "Your username"
                    }
                    rules={{
                      required: t
                        ? t("general.form.username.required")
                        : "Required",
                    }}
                  />

                  <FormField
                    name="email"
                    type="email"
                    label={t ? t("general.form.email.label") : "Email"}
                    placeholder={
                      t
                        ? t("general.form.email.placeholder")
                        : "you@example.com"
                    }
                    rules={{
                      required: t
                        ? t("general.form.email.required")
                        : "Required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t
                          ? t("general.form.email.pattern")
                          : "Invalid email",
                      },
                    }}
                  />

                  <FormField
                    name="password"
                    type="password"
                    label={t ? t("general.form.password.label") : "Password"}
                    placeholder={
                      t
                        ? t("general.form.password.placeholder")
                        : "New password"
                    }
                    rules={{
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/,
                        message: t
                          ? t("general.form.password.pattern")
                          : "Invalid password",
                      },
                    }}
                  />

                  <FormField
                    name="confirmPassword"
                    type="password"
                    label={
                      t
                        ? t("general.form.confirmPassword.label")
                        : "Confirm Password"
                    }
                    placeholder={
                      t
                        ? t("general.form.confirmPassword.placeholder")
                        : "Confirm new password"
                    }
                    rules={{
                      validate: (val) =>
                        watch("password")
                          ? val === watch("password") ||
                            (t
                              ? t("general.form.confirmPassword.match")
                              : "Passwords must match")
                          : true,
                    }}
                  />

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      {t ? t("general.form.buttons.update") : "Update Profile"}
                    </Button>
                    <button
                      type="button"
                      className="btn btn-ghost flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        reset({
                          username: user?.username || "",
                          email: user?.email || "",
                          password: "",
                          confirmPassword: "",
                        });
                        setIsEditing(false);
                      }}
                    >
                      {t ? t("general.form.buttons.cancel") : "Cancel"}
                    </button>
                  </div>
                </form>
              </FormProvider>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
