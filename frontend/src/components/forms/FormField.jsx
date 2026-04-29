import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useLocale } from "@/providers/LocaleProvider"
import EyeSVG from "@/components/svg/EyeSVG"
import EyeOffSVG from "@/components/svg/EyeOffSVG"

const FormField = ({
  name,
  label,
  type = "text",
  placeholder,
  as = "input",
  options = [],
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const { t } = useLocale()
  const [showPassword, setShowPassword] = useState(false)

  const error = errors?.[name]
  const isPasswordField = type === "password"
  const inputType = isPasswordField && showPassword ? "text" : type

  const baseClass = `w-full ${
    as === "input" ? "input input-lg" : ""
  } ${as === "textarea" ? "textarea textarea-md" : ""} ${
    as === "select" ? "select select-lg" : ""
  } ${error ? "input-error" : ""}`

  const commonProps = {
    className: baseClass,
    ...register(name),
    ...rest,
  }

  const renderField = () => {
    if (as === "textarea") {
      return <textarea {...commonProps} placeholder={placeholder} />
    }

    if (as === "select") {
      return (
        <select {...commonProps}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        {...commonProps}
        type={inputType}
        placeholder={placeholder}
        {...(type === "number" ? { step: "0.01" } : {})}
      />
    )
  }

  return (
    <div className="w-full">
      {type !== "checkbox" && type !== "radio" && (
        <label className="floating-label w-full relative">
          <span>{label}</span>
          {renderField()}
          {isPasswordField && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-base-content/50 hover:text-base-content transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <EyeOffSVG /> : <EyeSVG />}
            </button>
          )}
        </label>
      )}

      {/* CHECKBOX SIMPLE */}
      {type === "checkbox" && options.length === 0 && (
        <label className="label cursor-pointer gap-3">
          <input type="checkbox" className="checkbox checkbox-lg" {...register(name)} {...rest} />
          <span className="label-text">{label}</span>
        </label>
      )}

      {/* CHECKBOX GROUP */}
      {type === "checkbox" && options.length > 0 && (
        <div className="flex flex-col gap-2">
          <span id={`${name}-label`} className="font-medium">
            {label}
          </span>

          <div role="group" aria-labelledby={`${name}-label`}>
            {options.map((opt) => (
              <label key={opt.value} className="label cursor-pointer gap-3 justify-start">
                <input type="checkbox" value={opt.value} className="checkbox" {...register(name)} />
                <span className="label-text">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* RADIO GROUP */}
      {type === "radio" && (
        <div className="flex flex-col gap-2">
          <span id={`${name}-label`} className="font-medium">
            {label}
          </span>

          <div role="group" aria-labelledby={`${name}-label`}>
            {options.map((opt) => (
              <label key={opt.value} className="label cursor-pointer gap-3 justify-start">
                <input type="radio" value={opt.value} className="radio" {...register(name)} />
                <span className="label-text">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p id={`${name}-error`} className="ml-1 mt-1 text-error text-sm">
          {t(error.message) || "This field is required"}
        </p>
      )}
    </div>
  )
}

export default FormField
