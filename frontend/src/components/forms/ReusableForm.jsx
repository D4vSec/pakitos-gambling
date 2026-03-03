import React from "react"
import { useForm } from "react-hook-form"

const ReusableForm = ({ fields = [], onSubmit, buttonText = "Enviar" }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    return (
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

                            {field.type === "textarea" ? (
                                <textarea
                                    placeholder={field.placeholder}
                                    className={`textarea textarea-bordered w-full ${errors[field.name] ? "textarea-error" : ""}`}
                                    {...register(field.name, { required: field.required || false })}
                                />
                            ) : field.type === "select" ? (
                                <select
                                    className={`select select-bordered w-full ${errors[field.name] ? "select-error" : ""}`}
                                    {...register(field.name, { required: field.required || false })}
                                >
                                    {field.options?.map((option, idx) => (
                                        <option key={idx} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === "radio" ? (
                                field.options?.map((option, idx) => (
                                    <label key={idx} className="label cursor-pointer gap-2">
                                        <input
                                            type="radio"
                                            value={option.value}
                                            {...register(field.name, {
                                                required: field.required || false,
                                            })}
                                            className="radio"
                                        />
                                        <span className="label-text">{option.label}</span>
                                    </label>
                                ))
                            ) : field.type === "checkbox" ? (
                                <label className="label cursor-pointer gap-2">
                                    <input
                                        type="checkbox"
                                        {...register(field.name, {
                                            required: field.required || false,
                                        })}
                                        className="checkbox"
                                    />
                                    <span className="label-text">{field.label}</span>
                                </label>
                            ) : (
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className={`input input-bordered w-full ${errors[field.name] ? "input-error" : ""}`}
                                    {...register(field.name, { required: field.required || false })}
                                />
                            )}

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
                        <button className="btn btn-primary w-full rounded-2xl">{buttonText}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReusableForm
