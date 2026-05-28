import React, { useMemo } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/schemas/registerSchema"
import { useSession } from "@/providers/SessionProvider"
import { useLocale } from "@/providers/LocaleProvider"
import FormField from "@/components/forms/FormField"
import Title from "@/components/layout/fonts/Title"
import Button from "@/components/buttons/Button"
import GradientBg from "@/components/layout/GradientBg"
import { Navigate } from "react-router-dom"

const Register = () => {
  const { t } = useLocale()
  const { register, isLogged } = useSession()

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
        label: t("forms.fields.username.label"),
        placeholder: t("forms.fields.username.placeholder"),
      },
      {
        name: "email",
        type: "email",
        label: t("forms.fields.email.label"),
        placeholder: t("forms.fields.email.placeholder"),
      },
      {
        name: "password",
        type: "password",
        label: t("forms.fields.password.label"),
        placeholder: t("forms.fields.password.placeholder"),
      },
      {
        name: "confirmPassword",
        type: "password",
        label: t("forms.fields.confirmPassword.label"),
        placeholder: t("forms.fields.confirmPassword.placeholder"),
      },
    ],
    [t],
  )

  const onSubmit = (data) => {
    const { confirmPassword, ...info } = data
    register(info)
    methods.reset()
  }

  return isLogged ? (
    <Navigate to="/home" replace />
  ) : (
    <GradientBg>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <Title>{t("forms.page.register")}</Title>
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
                  <Button variant="accent" size="lg" className="w-full">
                    {t("forms.buttons.register")}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </GradientBg>
  )
}

export default Register
