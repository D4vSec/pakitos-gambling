import React from "react"
import Button from "@/components/buttons/Button"
import { IconTrashX } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"
import { IconPlus } from "@tabler/icons-react"
const BetOptionsFieldArray = ({
  append,
  disabled,
  errors,
  fields,
  register,
  remove,
}) => {
  const { t } = useLocale()
  const hasRootError =
    !Array.isArray(errors?.options) &&
    typeof errors?.options?.message === "string"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">
            {t("forms.fields.betOptions.label")}
          </h2>
          <p className="text-sm text-base-content/70">
            {t("forms.fields.betOptions.hint")}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-fit"
          onClick={() => append({ label: "", odd: "2.00" })}
          svg={<IconPlus />}
          disabled={disabled || fields.length >= 20}>
          {t("forms.fields.betOptions.addOption")}
        </Button>
      </div>

      {disabled && (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          {t("forms.fields.betOptions.locked")}
        </div>
      )}

      {hasRootError && (
        <p className="text-sm text-error">{t(errors.options.message)}</p>
      )}

      <div className="grid gap-4">
        {fields.map((field, index) => {
          const labelError = errors?.options?.[index]?.label?.message
          const oddError = errors?.options?.[index]?.odd?.message

          return (
            <div
              key={field.id}
              className="rounded-xl border border-secondary/50 bg-base-100 px-4 py-2 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-semibold">
                  {t("forms.fields.betOptions.option", { index: index + 1 })}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  svg={<IconTrashX />}
                  onClick={() => remove(index)}
                  disabled={disabled || fields.length <= 2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="floating-label w-full">
                    <span>{t("forms.fields.betOptionLabel.label")}</span>
                    <input
                      className={`input input-md sm:input-lg w-full ${labelError ? "input-error" : ""} border-secondary/10`}
                      placeholder={t("forms.fields.betOptionLabel.placeholder")}
                      disabled={disabled}
                      {...register(`options.${index}.label`)}
                    />
                  </label>
                  {labelError && (
                    <p className="ml-1 mt-1 text-sm text-error">
                      {t(labelError)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="floating-label w-full">
                    <span>{t("forms.fields.betOptionOdd.label")}</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className={`input input-lg w-full ${oddError ? "input-error" : ""} border-secondary/10`}
                      placeholder={t("forms.fields.betOptionOdd.placeholder")}
                      disabled={disabled}
                      {...register(`options.${index}.odd`)}
                    />
                  </label>
                  {oddError && (
                    <p className="ml-1 mt-1 text-sm text-error">
                      {t(oddError)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BetOptionsFieldArray
