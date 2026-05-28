import React, { useEffect, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import FormField from "@/components/forms/FormField"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import useAPI from "@/hooks/useAPI"
import Title from "@/components/layout/fonts/Title"
import Button from "@/components/buttons/Button"
import GradientBg from "@/components/layout/GradientBg"
import UserSVG from "@/components/svg/users/UserSVG"
import ShieldSVG from "@/components/svg/pictures/ShieldSVG"
import AlertTriangleSVG from "@/components/svg/actions/AlertTriangleSVG"

const Profile = () => {
  const { user, updateProfile, logout, getAccessToken, getRefreshToken } =
    useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()
  const { destroy } = useAPI()
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

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

  const handleProfileSubmit = async (data) => {
    setProfileLoading(true)
    try {
      await updateProfile({ username: data.username, email: data.email })
    } catch {
      // updateProfile already shows the error notification
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (data) => {
    setPasswordLoading(true)
    try {
      await updateProfile({ password: data.newPassword })
      passwordMethods.reset()
      logout()
    } catch {
      // updateProfile already shows the error notification
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await destroy("/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "x-refresh-token": getRefreshToken(),
        },
      })
      logout()
    } catch {
      addNotification(t("message.error.UNKNOWN_ERROR"), "error")
    }
  }

  const confirmDeleteAccount = () =>
    addNotification(t("message.modal.deleteAccount.title"), "modal", {
      onAccept: handleDeleteAccount,
      acceptLabel: t("message.modal.deleteAccount.accept"),
      cancelLabel: t("message.modal.deleteAccount.cancel"),
    })

  return (
    <GradientBg>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <Title>{t("pages.profile.title")}</Title>

        <div className="w-full max-w-5xl flex flex-col gap-6">
          {/* PERFIL */}
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
                {/* Form */}
                <div className="flex-1">
                  <FormProvider {...profileMethods}>
                    <form
                      onSubmit={profileMethods.handleSubmit(
                        handleProfileSubmit,
                      )}
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

                      <Button
                        variant="primary"
                        className="mt-2"
                        disabled={profileLoading}>
                        {profileLoading ? "..." : t("forms.buttons.update")}
                      </Button>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>

          {/* SEGURIDAD */}
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

                  <Button
                    variant="secondary"
                    className="mt-2"
                    disabled={passwordLoading}>
                    {passwordLoading
                      ? "..."
                      : t("forms.buttons.changePassword")}
                  </Button>
                </form>
              </FormProvider>
            </div>
          </div>

          {/* DANGER ZONE */}
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
                onClick={confirmDeleteAccount}>
                {t("pages.profile.danger.deleteAccount")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GradientBg>
  )
}

export default Profile
