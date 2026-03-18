import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import Title from "@/components/Title"
import Button from "@/components/buttons/Button"
import { FormField } from "@/components/forms/FormField"
import { useLocale } from "@/providers/LocaleProvider"
import { useSession } from "@/providers/SessionProvider"

const AddBalance = () => {
    const { t } = useLocale()
    const { addBalance } = useSession()

    const methods = useForm({
        defaultValues: {
            amount: "",
        },
    })

    const formFields = [
        {
            name: "amount",
            type: "number",
            label: t("general.addBalance.label"),
            placeholder: t("general.addBalance.placeholder"),
            rules: {
                required: t("general.addBalance.required"),
                min: {
                    value: 0.01,
                    message: t("general.addBalance.min"),
                },
            },
        },
    ]

    const onSubmit = (data) => {
        addBalance(parseFloat(data.amount))
        methods.reset()
    }

    return (
        <div className="bg-linear-to-b from-primary to-base-200 min-h-full flex flex-col justify-center items-center gap-4">
            <Title>{t("general.addBalance.title")}</Title>
            <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
                <div className="card-body">
                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                        >
                            {formFields.map((field) => (
                                <FormField
                                    key={field.name}
                                    name={field.name}
                                    type={field.type}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    rules={field.rules}
                                />
                            ))}

                            <div className="form-control mt-2">
                                <Button className="w-full">{t("general.addBalance.button")}</Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    )
}

export default AddBalance
