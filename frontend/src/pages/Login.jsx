import React from "react"
import ReusableForm from "@/components/forms/ReusableForm"

const Login = () => {
        const handleSubmit = (data) => {
            console.log("Register data:", data)
        }

    const testFields = [
        {
            name: "textField",
            label: "Texto",
            placeholder: "Escribe algo...",
            type: "text",
            required: true,
        },
        {
            name: "emailField",
            label: "Correo",
            placeholder: "correo@ejemplo.com",
            type: "email",
            required: true,
        },
        {
            name: "passwordField",
            label: "Contraseña",
            placeholder: "Escribe tu contraseña",
            type: "password",
            required: true,
        },
        { name: "numberField", label: "Número", placeholder: "123", type: "number" },
        { name: "urlField", label: "Página web", placeholder: "https://ejemplo.com", type: "url" },
        { name: "telField", label: "Teléfono", placeholder: "+1234567890", type: "tel" },
        { name: "dateField", label: "Fecha", type: "date" },
        { name: "colorField", label: "Color favorito", type: "color" },
        { name: "checkboxField", label: "Aceptar términos", type: "checkbox", required: true },
        {
            name: "radioField",
            label: "Género",
            type: "radio",
            required: true,
            options: [
                { label: "Masculino", value: "male" },
                { label: "Femenino", value: "female" },
            ],
        },
        {
            name: "textareaField",
            label: "Comentarios",
            placeholder: "Escribe aquí...",
            type: "textarea",
        },
        {
            name: "selectField",
            label: "País",
            type: "select",
            options: [
                { label: "España", value: "es" },
                { label: "México", value: "mx" },
                { label: "Argentina", value: "ar" },
            ],
        },
    ]

    return (
        <div>
            <ReusableForm fields={testFields} onSubmit={handleSubmit} buttonText="Iniciar sesión" />
        </div>
    )
}

export default Login
