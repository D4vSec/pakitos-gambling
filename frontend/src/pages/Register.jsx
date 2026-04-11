import React from "react"
import Title from "@/components/Title"
import { useLocale } from "@/providers/LocaleProvider"
import { useForm, FormProvider } from "react-hook-form"
import { useSession } from "@/providers/SessionProvider"
import { FormField } from "@/components/forms/FormField"
import Button from "@/components/buttons/Button"
import GradientBg from "@/components/layout/GradientBg"

const Register = () => {
    const { t } = useLocale()
    const { register } = useSession()

    const methods = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const { watch } = methods

    const passwordValue = watch("password")

    const formFields = [
        {
            name: "username",
            type: "text",
            label: t("general.form.username.label"),
            placeholder: t("general.form.username.placeholder"),
            rules: {
                required: t("general.form.username.required"),
                minLength: { value: 3, message: t("general.form.username.minLength") },
                maxLength: { value: 25, message: t("general.form.username.maxLength") },
            },
        },
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
        {
            name: "confirmPassword",
            type: "password",
            label: t("general.form.confirmPassword.label"),
            placeholder: t("general.form.confirmPassword.placeholder"),
            rules: {
                required: t("general.form.confirmPassword.required"),
                validate: (value) =>
                    value === passwordValue || t("general.form.confirmPassword.match"),
            },
        },
    ]

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
        </GradientBg>
    )
}

export default Register
