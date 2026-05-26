import React, { useCallback, useEffect, useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"
import BetOptionsFieldArray from "@/components/admin/forms/BetOptionsFieldArray"
import AdminSectionNav from "@/components/admin/components/AdminSectionNav"
import Button from "@/components/buttons/Button"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import FormField from "@/components/forms/FormField"
import Loading from "@/components/Loading"
import GradientBg from "@/components/layout/GradientBg"
import Title from "@/components/layout/fonts/Title"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { betSchema } from "@/schemas/betSchemas"
import { toDateTimeLocalValue } from "@/utils/betsUtils"

const EMPTY_OPTIONS = [
  { label: "", odd: "2.00" },
  { label: "", odd: "2.00" },
]

const normalizeBetOptions = (options = []) =>
  options.map((option) => ({
    label: option.label.trim(),
    odd: Number(option.odd),
  }))

const areBetOptionsEqual = (currentOptions = [], initialOptions = []) => {
  if (currentOptions.length !== initialOptions.length) return false

  return currentOptions.every((option, index) => {
    const initialOption = initialOptions[index]

    return (
      option.label === initialOption?.label &&
      Number(option.odd) === Number(initialOption?.odd)
    )
  })
}

const BetForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLocale()
  const { addNotification } = useNotification()
  const { createBet, getAdminBet, updateBet } = useAdmin()
  const [loading, setLoading] = useState(Boolean(id))
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [optionsLocked, setOptionsLocked] = useState(false)
  const [initialBet, setInitialBet] = useState(null)
  const isEdit = Boolean(id)

  const methods = useForm({
    resolver: zodResolver(betSchema),
    defaultValues: {
      label: "",
      ends_at: "",
      options: EMPTY_OPTIONS,
    },
  })

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = methods

  const { append, fields, remove, replace } = useFieldArray({
    control,
    name: "options",
  })

  const loadBet = useCallback(async () => {
    if (!isEdit) {
      setLoading(false)
      return
    }

    setLoading(true)
    setNotFound(false)

    const response = await getAdminBet(id)

    if (!response) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const nextValues = {
      label: response.bet?.label ?? "",
      ends_at: toDateTimeLocalValue(response.bet?.ends_at),
      options:
        response.options?.length > 0
          ? response.options.map((option) => ({
              label: option.label ?? "",
              odd: String(option.odd ?? ""),
            }))
          : EMPTY_OPTIONS,
    }

    reset(nextValues)
    replace(nextValues.options)
    setOptionsLocked(Number(response.totalPool || 0) > 0)
    setInitialBet(nextValues)
    setLoading(false)
  }, [getAdminBet, id, isEdit, replace, reset])

  useEffect(() => {
    loadBet()
  }, [loadBet])

  if (loading) {
    return <Loading />
  }

  const onSubmit = async (data) => {
    setSubmitting(true)

    const normalizedLabel = data.label.trim()
    const normalizedOptions = normalizeBetOptions(data.options)

    if (!isEdit) {
      const createdBet = await createBet({
        label: normalizedLabel,
        ends_at: data.ends_at,
        options: normalizedOptions,
      })

      if (createdBet?.id) {
        navigate(`/admin/bets/${createdBet.id}`)
      }

      setSubmitting(false)
      return
    }

    const payload = {}

    if (normalizedLabel !== initialBet?.label) {
      payload.label = normalizedLabel
    }

    if (data.ends_at !== initialBet?.ends_at) {
      payload.ends_at = data.ends_at
    }

    if (
      !optionsLocked &&
      !areBetOptionsEqual(normalizedOptions, initialBet?.options || [])
    ) {
      payload.options = normalizedOptions
    }

    if (Object.keys(payload).length === 0) {
      addNotification(t("message.info.NO_CHANGES"), "info")
      setSubmitting(false)
      return
    }

    const response = await updateBet(id, payload)

    if (response) {
      navigate(`/admin/bets/${id}`)
    }

    setSubmitting(false)
  }

  return loading ? (
    <Loading />
  ) : notFound ? (
    <GradientBg>
      <div className="flex w-full max-w-5xl flex-col gap-4">
        <GoBackBtn link="/admin/bets" />
        <AdminSectionNav />
        <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-xl">
          <Title>{t("adminPanel.bets.detail.noBet")}</Title>
        </section>
      </div>
    </GradientBg>
  ) : (
    <GradientBg>
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <AdminSectionNav />
        <div>
          <GoBackBtn link={isEdit ? `/admin/bets/${id}` : "/admin/bets"} />
        </div>
        <Title>
          {t(isEdit ? "forms.page.updateBet" : "forms.page.createBet")}
        </Title>
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl md:p-8">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  name="label"
                  type="text"
                  label={t("forms.fields.betLabel.label")}
                  placeholder={t("forms.fields.betLabel.placeholder")}
                />
                <FormField
                  name="ends_at"
                  type="datetime-local"
                  label={t("forms.fields.endsAt.label")}
                  placeholder={t("forms.fields.endsAt.placeholder")}
                />
              </div>
              <BetOptionsFieldArray
                append={append}
                disabled={optionsLocked}
                errors={errors}
                fields={fields}
                register={register}
                remove={remove}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
                <Button type="submit" variant="success" disabled={submitting}>
                  {t(isEdit ? "forms.buttons.update" : "forms.buttons.create")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    navigate(isEdit ? `/admin/bets/${id}` : "/admin/bets")
                  }>
                  {t("forms.buttons.goBack")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </GradientBg>
  )
}

export default BetForm
