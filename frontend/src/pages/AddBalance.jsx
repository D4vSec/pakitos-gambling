import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addBalanceSchema } from "@/schemas/addBalanceSchema"
import { useLocale } from "@/providers/LocaleProvider"
import { useSession } from "@/providers/SessionProvider"
import Title from "@/components/layout/fonts/Title"
import Button from "@/components/buttons/Button"
import FormField from "@/components/forms/FormField"
import GradientBg from "@/components/layout/GradientBg"

// TODO: Mirar por que no sale el mensaje que tiene que salir
const AddBalance = () => {
  const { t } = useLocale()
  const { addBalance } = useSession()

  const methods = useForm({
    resolver: zodResolver(addBalanceSchema),
    defaultValues: {
      amount: "",
    },
  })

  const formFields = [
    {
      name: "amount",
      type: "number",
      label: t("pages.addBalance.label"),
      placeholder: t("pages.addBalance.placeholder"),
    },
  ]

  const onSubmit = (data) => {
    addBalance(data.amount)
    methods.reset()
  }

  return (
    <GradientBg>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <Title>{t("pages.addBalance.title")}</Title>
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
                    {t("pages.addBalance.button")}
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

export default AddBalance
