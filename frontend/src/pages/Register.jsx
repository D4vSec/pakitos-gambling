import React, { useMemo } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/schemas/registerSchema"
import { useSession } from "@/providers/SessionProvider"
import { useLocale } from "@/providers/LocaleProvider"
import FormField from "@/components/forms/FormField"
import Title from "@/components/Title"
import Button from "@/components/buttons/Button"
import GradientBg from "@/components/layout/GradientBg"

const Register = () => {
  const { t } = useLocale()
  const { register } = useSession()

  const methods = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const formFields = useMemo(
    () => [
      {
        name: "username",
        type: "text",
        label: t("general.form.username.label"),
        placeholder: t("general.form.username.placeholder"),
      },
      {
        name: "email",
        type: "email",
        label: t("general.form.email.label"),
        placeholder: t("general.form.email.placeholder"),
      },
      {
        name: "password",
        type: "password",
        label: t("general.form.password.label"),
        placeholder: t("general.form.password.placeholder"),
      },
      {
        name: "confirmPassword",
        type: "password",
        label: t("general.form.confirmPassword.label"),
        placeholder: t("general.form.confirmPassword.placeholder"),
      },
    ],
    [t],
  )

  const onSubmit = (data) => {
    const { confirmPassword, ...info } = data
    register(info)
    methods.reset()
  }

  return (
    <GradientBg>
      <Title>{t("general.form.page.register")}</Title>
      <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4">
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  label={field.label}
                  placeholder={field.placeholder}
                />
              ))}

              <div className="form-control mt-2">
                <Button className="w-full">
                  {t("general.form.buttons.register")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </GradientBg>
  )
}

export default Register
