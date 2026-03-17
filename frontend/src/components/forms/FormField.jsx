import { useFormContext } from "react-hook-form"

export const FormField = ({
    name,
    label,
    type = "text",
    placeholder,
    rules,
    as = "input", // "input" | "textarea" | "select"
    options = [], // para select, radio y checkbox group
    ...rest
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext()

    const error = errors?.[name]

    const baseClass = `w-full ${as === "input" ? "input input-lg" : ""} ${as === "textarea" ? "textarea textarea-md" : ""} ${as === "select" ? "select select-md" : ""} ${error ? "input-error" : ""}`

    return (
        <div className="w-full">
            {/* LABEL NORMAL (no para checkbox/radio grupales) */}
            {type !== "checkbox" && type !== "radio" && (
                <label className="floating-label w-full">
                    <span>{label}</span>

                    {as === "input" && (
                        <input
                            type={type}
                            placeholder={placeholder}
                            className={baseClass}
                            title={error?.message}
                            {...register(name, rules)}
                            {...rest}
                            {...(type === "number" ? { step: "0.01" } : {})}
                        />
                    )}

                    {as === "textarea" && (
                        <textarea
                            placeholder={placeholder}
                            className={baseClass}
                            title={error?.message}
                            {...register(name, rules)}
                            {...rest}
                        />
                    )}

                    {as === "select" && (
                        <select
                            className={baseClass}
                            title={error?.message}
                            {...register(name, rules)}
                            {...rest}
                        >
                            <option value="" disabled>
                                {placeholder}
                            </option>

                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    )}
                </label>
            )}

            {/* CHECKBOX SIMPLE (boolean) */}
            {type === "checkbox" && options.length === 0 && (
                <label className="label cursor-pointer gap-3">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-lg"
                        {...register(name, rules)}
                        {...rest}
                    />
                    <span className="label-text">{label}</span>
                </label>
            )}

            {/* CHECKBOX GROUP (array) */}
            {type === "checkbox" && options.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{label}</span>

                    {options.map((opt) => (
                        <label key={opt.value} className="label cursor-pointer gap-3 justify-start">
                            <input
                                type="checkbox"
                                value={opt.value}
                                className="checkbox"
                                {...register(name, rules)}
                            />
                            <span className="label-text">{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}

            {/* RADIO GROUP */}
            {type === "radio" && (
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{label}</span>

                    {options.map((opt) => (
                        <label key={opt.value} className="label cursor-pointer gap-3 justify-start">
                            <input
                                type="radio"
                                value={opt.value}
                                className="radio"
                                {...register(name, rules)}
                            />
                            <span className="label-text">{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}

            {error && <p className="ml-1 mt-1 text-error text-sm">{error.message}</p>}
        </div>
    )
}
