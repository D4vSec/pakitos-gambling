import React, { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import FormField from "@/components/forms/FormField"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Title from "@/components/layout/fonts/Title"
import Button from "@/components/buttons/Button"
import GradientBg from "@/components/layout/GradientBg"
import UserSVG from "@/components/svg/users/UserSVG"
import ShieldSVG from "@/components/svg/pictures/ShieldSVG"
import AlertTriangleSVG from "@/components/svg/actions/AlertTriangleSVG"

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
      <Title>{t("pages.profile.title")}</Title>

      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* 🔵 PERFIL */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl">
              <UserSVG />
              {t("pages.profile.profileCard.title")}
            </h2>

            <p className="text-base-content mb-6">
              {t("pages.profile.profileCard.description")}
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
                  {t("pages.profile.changePhoto")}
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
                      label={t("forms.fields.username.label")}
                      rules={{
                        required: t("forms.fields.username.required"),
                      }}
                    />

                    <FormField
                      name="email"
                      type="email"
                      label={t("forms.email.label")}
                      rules={{
                        required: t("forms.email.required"),
                      }}
                    />

                    <Button variant="primary" className="mt-2">
                      {t("forms.buttons.update")}
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
              {t("pages.profile.security.title")}
            </h2>

            <p className="text-base-content mb-6">
              {t("pages.profile.security.description")}
            </p>

            <FormProvider {...passwordMethods}>
              <form
                onSubmit={passwordMethods.handleSubmit(handlePasswordSubmit)}
                className="flex flex-col gap-4">
                <FormField
                  name="currentPassword"
                  type="password"
                  label={t("forms.fields.password.current")}
                  rules={{ required: t("forms.fields.password.required") }}
                />

                <FormField
                  name="newPassword"
                  type="password"
                  label={t("forms.fields.password.new")}
                  rules={{
                    required: t("forms.fields.password.required"),
                    minLength: {
                      value: 8,
                      message: t("forms.fields.password.minLength"),
                    },
                  }}
                />

                <FormField
                  name="confirmPassword"
                  type="password"
                  label={t("forms.fields.password.confirm")}
                  rules={{
                    validate: (value) =>
                      value === newPasswordValue ||
                      t("forms.confirmPassword.match"),
                  }}
                />

                <Button variant="secondary" className="mt-2">
                  {t("forms.buttons.changePassword")}
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
              {t("pages.profile.danger.title")}
            </h2>

            <p className="text-sm opacity-70">
              {t("pages.profile.danger.description")}
            </p>

            <Button
              variant="error"
              className="mt-4"
              onClick={handleDeleteAccount}>
              {t("pages.profile.danger.deleteAccount")}
            </Button>
          </div>
        </div>
      </div>
    </GradientBg>
  )
}

export default Profile
