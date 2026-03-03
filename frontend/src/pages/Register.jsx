import React from "react"
import ReusableForm from "@/components/forms/ReusableForm"
import Title from "@/components/Title"
import { useLocale } from "@/providers/LocaleProvider"

const Register = () => {
    const { t } = useLocale()
    const registerFields = [
        {
            name: "username",
            placeholder: t("general.form.username.placeholder"),
            type: "text",
            label: t("general.form.username.label"),
        },
        {
            name: "email",
            placeholder: t("general.form.email.placeholder"),
            type: "email",
            label: t("general.form.email.label"),
        },
        {
            name: "password",
            placeholder: t("general.form.password.placeholder"),
            type: "password",
            label: t("general.form.password.label"),
        },
        {
            name: "confirmPassword",
            placeholder: t("general.form.confirmPassword.placeholder"),
            type: "password",
            label: t("general.form.confirmPassword.label"),
        },
    ]

    const handleSubmit = (data) => {
        console.log("Register data:", data)
    }
    return (
        <div className="bg-gradient-to-b from-primary to-base-200 min-h-full flex flex-col justify-center items-center gap-4">
            <Title>Register</Title>
            <div className="p-4">
                <ReusableForm
                    fields={registerFields}
                    onSubmit={handleSubmit}
                    buttonText={t("general.form.buttons.register")}
                />
            </div>
        </div>
    )
}

export default Register
