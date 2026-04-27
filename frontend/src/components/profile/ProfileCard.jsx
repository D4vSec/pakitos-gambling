import React, { useEffect, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema } from "@/schemas/profileSchema"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"
import Card from "../landingPage/Card"
import Button from "../buttons/Button"
import UserSVG from "../svg/UserSVG"
import FormField from "@/components/forms/FormField"

const ProfileCard = () => {
  const { user, setUser, updateProfile, logout } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const methods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const { reset, handleSubmit, watch } = methods

  useEffect(() => {
    reset({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    })
  }, [user])

  const onSubmit = async (data) => {
    if (data.password && data.password !== data.confirmPassword) {
      addNotification(t("general.form.confirmPassword.match"), "error")
      return
    }

    const body = {
      username: data.username,
      email: data.email,
    }

    const pwd = data.password?.trim().replace(/[\r\n]+/g, "")
    if (pwd) body.password = pwd

    try {
      const fresh = await updateProfile(body)

      if (pwd) {
        addNotification(t("message.info.passwordChanged"), "info")
        logout()
      } else if (fresh && setUser) {
        setUser(fresh)
      }

      reset({ ...data, password: "", confirmPassword: "" })
      setIsEditing(false)
    } catch (err) {
      console.error("Update profile failed", err)
    }
  }

  return (
    <Card className="py-6 px-6 border-0">
      <h2 className="flex items-center gap-2 text-2xl">
        <UserSVG />
        {t("general.profile.profileCard.title")}
      </h2>

      <p className="text-1lg">{t("general.profile.profileCard.description")}</p>

      <div className="mt-1">
        <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body">
            {!isEditing ? (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t("general.form.username.label")}
                  </div>
                  <div className="text-lg font-medium">
                    {user?.username || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">
                    {t("general.form.email.label")}
                  </div>
                  <div className="text-lg font-medium">
                    {user?.email || "-"}
                  </div>
                </div>

                <Button onClick={() => setIsEditing(true)} className="w-full">
                  {t("general.form.buttons.update")}
                </Button>
              </div>
            ) : (
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4">
                  <FormField
                    name="username"
                    type="text"
                    label={t("general.form.username.label")}
                    placeholder={t("general.form.username.placeholder")}
                  />

                  <FormField
                    name="email"
                    type="email"
                    label={t("general.form.email.label")}
                    placeholder={t("general.form.email.placeholder")}
                  />

                  <FormField
                    name="password"
                    type="password"
                    label={t("general.form.password.label")}
                    placeholder={t("general.form.password.placeholder")}
                  />

                  <FormField
                    name="confirmPassword"
                    type="password"
                    label={t("general.form.confirmPassword.label")}
                    placeholder={t("general.form.confirmPassword.placeholder")}
                  />

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      {t("general.form.buttons.update")}
                    </Button>

                    <button
                      type="button"
                      className="btn btn-ghost flex-1"
                      onClick={() => {
                        reset({
                          username: user?.username || "",
                          email: user?.email || "",
                          password: "",
                          confirmPassword: "",
                        })
                        setIsEditing(false)
                      }}>
                      {t("general.form.buttons.cancel")}
                    </button>
                  </div>
                </form>
              </FormProvider>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProfileCard
