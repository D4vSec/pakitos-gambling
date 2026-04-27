import React, { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import FormField from "@/components/forms/FormField"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Title from "@/components/Title"
import Button from "@/components/buttons/Button"
import GradientBg from "@/components/layout/GradientBg"
import UserSVG from "@/components/svg/UserSVG"
import ShieldSVG from "@/components/svg/ShieldSVG"
import AlertTriangleSVG from "@/components/svg/AlertTriangleSVG"

const Profile = () => {
  const { user, updateProfile } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const profileMethods = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  })

  const passwordMethods = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const newPasswordValue = passwordMethods.watch("newPassword")

  useEffect(() => {
    if (user) {
      profileMethods.reset({
        username: user?.username || "",
        email: user?.email || "",
      })
    }
  }, [user])

  const handleProfileSubmit = (data) => {
    console.log("Actualizar perfil:", data)
    // updateProfile(data)
  }

  const handlePasswordSubmit = (data) => {
    console.log("Cambiar contraseña:", data)
    passwordMethods.reset()
  }

  const handleDeleteAccount = () => {
    console.log("Eliminar cuenta")
  }

  return (
    <GradientBg>
      <Title>{t("general.profile.title")}</Title>

      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* 🔵 PERFIL */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl">
              <UserSVG />
              {t("general.profile.profileCard.title")}
            </h2>

            <p className="text-base-content mb-6">
              {t("general.profile.profileCard.description")}
            </p>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                  <div className="w-30 rounded-full ring ring-primary ring-offset-2">
                    <img
                      src={
                        user?.avatar_url ||
                        "https://www.alkain.com/DS-Contenido/ImageNotFound.jpg"
                      }
                      alt="avatar"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="btn-sm"
                  onClick={() => console.log("editando foto...")}>
                  {t("general.profile.changePhoto")}
                </Button>
              </div>

              {/* Form */}
              <div className="flex-1">
                <FormProvider {...profileMethods}>
                  <form
                    onSubmit={profileMethods.handleSubmit(handleProfileSubmit)}
                    className="flex flex-col gap-4">
                    <FormField
                      name="username"
                      type="text"
                      label={t("general.form.username.label")}
                      rules={{
                        required: t("general.form.username.required"),
                      }}
                    />

                    <FormField
                      name="email"
                      type="email"
                      label={t("general.form.email.label")}
                      rules={{
                        required: t("general.form.email.required"),
                      }}
                    />

                    <Button variant="primary" className="mt-2">
                      {t("general.form.buttons.update")}
                    </Button>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </div>

        {/* 🟡 SEGURIDAD */}
        <div className="card bg-base-100 shadow-xl border border-warning/30">
          <div className="card-body">
            <h2 className="card-title text-xl">
              <ShieldSVG />
              {t("general.profile.security.title")}
            </h2>

            <p className="text-base-content mb-6">
              {t("general.profile.security.description")}
            </p>

            <FormProvider {...passwordMethods}>
              <form
                onSubmit={passwordMethods.handleSubmit(handlePasswordSubmit)}
                className="flex flex-col gap-4">
                <FormField
                  name="currentPassword"
                  type="password"
                  label={t("general.form.password.current")}
                  rules={{ required: t("general.form.password.required") }}
                />

                <FormField
                  name="newPassword"
                  type="password"
                  label={t("general.form.password.new")}
                  rules={{
                    required: t("general.form.password.required"),
                    minLength: {
                      value: 8,
                      message: t("general.form.password.minLength"),
                    },
                  }}
                />

                <FormField
                  name="confirmPassword"
                  type="password"
                  label={t("general.form.password.confirm")}
                  rules={{
                    validate: (value) =>
                      value === newPasswordValue ||
                      t("general.form.confirmPassword.match"),
                  }}
                />

                <Button variant="secondary" className="mt-2">
                  {t("general.form.buttons.changePassword")}
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>

        {/* 🔴 DANGER ZONE */}
        <div className="card bg-base-100 shadow-xl border border-error">
          <div className="card-body">
            <h2 className="card-title text-error text-xl">
              <AlertTriangleSVG />
              {t("general.profile.danger.title")}
            </h2>

            <p className="text-sm opacity-70">
              {t("general.profile.danger.description")}
            </p>

            <Button
              variant="error"
              className="mt-4"
              onClick={handleDeleteAccount}>
              {t("general.profile.danger.deleteAccount")}
            </Button>
          </div>
        </div>
      </div>
    </GradientBg>
  )
}

export default Profile
