import React from "react"
import { useForm } from "react-hook-form"

/**
 * ReusableForm Component
 * @param {Object[]} fields - Array of field configs
 * @param {string} fields[].name - Input name
 * @param {string} fields[].placeholder - Input placeholder
 * @param {string} fields[].type - Input type (text, email, password, etc.)
 * @param {string} fields[].label - Input label
 * @param {Function} onSubmit - Submit handler
 * @param {string} buttonText - Submit button text
 */
export default function ReusableForm({ fields = [], onSubmit, buttonText = "Enviar" }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={index} className="form-control w-full">
                                {field.label && (
                                    <label className="label">
                                        <span className="label-text">{field.label}</span>
                                    </label>
                                )}

                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className="input input-bordered w-full"
                                    {...register(field.name, { required: true })}
                                />

                                {errors[field.name] && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            Este campo es requerido
                                        </span>
                                    </label>
                                )}
                            </div>
                        ))}

                        <div className="form-control mt-6">
                            <button className="btn btn-primary w-full rounded-2xl">
                                {buttonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

/**
 * ===============================
 * EJEMPLOS DE USO
 * ===============================
 */

// LOGIN
export function LoginExample() {
    const loginFields = [
        { name: "email", placeholder: "Correo electrónico", type: "email", label: "Email" },
        { name: "password", placeholder: "Contraseña", type: "password", label: "Password" },
    ]

    const handleLogin = (data) => {
        console.log("Login data:", data)
    }

    return <ReusableForm fields={loginFields} onSubmit={handleLogin} buttonText="Iniciar sesión" />
}

// REGISTER
export function RegisterExample() {
    const registerFields = [
        { name: "name", placeholder: "Nombre completo", type: "text", label: "Nombre" },
        { name: "email", placeholder: "Correo electrónico", type: "email", label: "Email" },
        { name: "password", placeholder: "Contraseña", type: "password", label: "Password" },
        {
            name: "confirmPassword",
            placeholder: "Confirmar contraseña",
            type: "password",
            label: "Confirmar Password",
        },
    ]

    const handleRegister = (data) => {
        console.log("Register data:", data)
    }

    return (
        <ReusableForm fields={registerFields} onSubmit={handleRegister} buttonText="Registrarse" />
    )
}
