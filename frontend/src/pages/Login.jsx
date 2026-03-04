import React from "react"
import Title from "@/components/Title"
import { useLocale } from "@/providers/LocaleProvider"
import { useForm, FormProvider } from "react-hook-form"
import { FormField } from "@/components/forms/FormField"
import Button from "@/components/buttons/Button"
import { useSession } from "@/providers/SessionProvider"

const Login = () => {
    const { t } = useLocale()
    const { login } = useSession()

    const methods = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const formFields = [
        {
            name: "email",
            type: "email",
            label: t("general.form.email.label"),
            placeholder: t("general.form.email.placeholder"),
            rules: {
                required: t("general.form.email.required"),
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("general.form.email.pattern"),
                },
            },
        },
        {
            name: "password",
            type: "password",
            label: t("general.form.password.label"),
            placeholder: t("general.form.password.placeholder"),
            rules: {
                required: t("general.form.password.required"),
                pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/,
                    message: t("general.form.password.pattern"),
                },
            },
        },
    ]

    const onSubmit = (data) => {
        console.log("Form submit", data)
        login(data)
        methods.reset()
    }

    return (
        <div className="bg-linear-to-b from-primary to-base-200 min-h-full flex flex-col justify-center items-center gap-4">
            <Title>{t("general.form.page.register")}</Title>
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
                                <Button className="w-full">
                                    {t("general.form.buttons.register")}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    )
}

export default Login
