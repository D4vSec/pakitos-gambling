import React, { useMemo } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/schemas/loginSchema"
import FormField from "@/components/forms/FormField"
import { useLocale } from "@/providers/LocaleProvider"
import { useSession } from "@/providers/SessionProvider"
import Button from "@/components/buttons/Button"
import Title from "@/components/layout/fonts/Title"
import GradientBg from "@/components/layout/GradientBg"
import { Navigate } from "react-router-dom"

const Login = () => {
  const { t } = useLocale()
  const { login, isLogged } = useSession()

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const formFields = useMemo(
    () => [
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
    ],
    [t],
  )

  const onSubmit = (data) => {
    login(data)
    methods.reset()
  }

  return isLogged ? (
    <Navigate to="/home" replace />
  ) : (
    <GradientBg>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <Title>{t("forms.page.login")}</Title>
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
                  <Button className="w-full">{t("forms.buttons.login")}</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </GradientBg>
  )
}

export default Login
