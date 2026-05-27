import React, { useMemo, useEffect, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useNavigate } from "react-router-dom"
import { useLocale } from "@/providers/LocaleProvider"
import FormField from "@/components/forms/FormField"
import Title from "@/components/layout/fonts/Title"
import Button from "@/components/buttons/Button"
import { useAdmin } from "@/providers/AdminProvider"
import { userSchema } from "@/schemas/userSchemas"
import { useSession } from "@/providers/SessionProvider"

import Loading from "@/components/Loading"

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register } = useSession()
  const { t } = useLocale()
  const { users, getUserById, updateUser } = useAdmin()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(isEdit)

  const methods = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "user",
      balance: "0.00",
      password: "",
      confirmPassword: "",
    },
  })

  const formFields = useMemo(() => {
    const baseFields = [
      {
        name: "username",
        type: "text",
        label: t("forms.fields.username.label"),
        placeholder: t("forms.fields.username.placeholder"),
      },
      {
        name: "email",
        type: "email",
        label: t("forms.fields.email.label"),
        placeholder: t("forms.fields.email.placeholder"),
      },
    ]

    const passwordFields = !isEdit
      ? [
          {
            name: "password",
            type: "password",
            label: t("forms.fields.password.label"),
            placeholder: t("forms.fields.password.placeholder"),
          },
          {
            name: "confirmPassword",
            type: "password",
            label: t("forms.fields.confirmPassword.label"),
            placeholder: t("forms.fields.confirmPassword.placeholder"),
          },
        ]
      : [
          {
            name: "password",
            type: "password",
            label: t("forms.fields.updatePassword.label"),
            placeholder: t("forms.fields.updatePassword.placeholder"),
          },
          {
            name: "confirmPassword",
            type: "password",
            label: t("forms.fields.confirmPassword.label"),
            placeholder: t("forms.fields.confirmPassword.placeholder"),
          },
        ]

    const rest = [
      {
        name: "balance",
        type: "number",
        label: t("forms.fields.balance.label"),
        placeholder: t("forms.fields.balance.placeholder"),
      },
      {
        name: "role",
        type: "text",
        label: t("forms.fields.role.label"),
        placeholder: t("forms.fields.role.placeholder"),
        as: "select",
        options: [
          { label: "User", value: "user" },
          { label: "Admin", value: "admin" },
        ],
      },
    ]

    return [...baseFields, ...passwordFields, ...rest]
  }, [isEdit])

  const fetchUser = async () => {
    if (!isEdit) {
      setLoading(false)
      return
    }

    if (!users) {
      setLoading(true)
      return
    }

    const user = await getUserById(id)

    if (!user) {
      setLoading(false)
      return
    }

    methods.reset({
      username: user.username ?? "",
      email: user.email ?? "",
      role: user.role ?? "user",
      balance: user.balance ?? "0.00",
      password: "",
      confirmPassword: "",
    })

    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [users, id, isEdit])

  const onSubmit = async (data) => {
    let payload = { ...data }

    delete payload.confirmPassword

    if (isEdit && !payload.password) {
      delete payload.password
    }

    if (!isEdit) {
      // Reutiliza /user/register, de momento
      payload = {
        username: data.username,
        email: payload.email,
        password: payload.password,
      }
      register(payload)
      console.log("register", payload)
    } else {
      payload = {
        username: data.username,
        email: payload.email,
        role: payload.role,
      }
      await updateUser(id, payload)
      navigate("/admin/users")
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Title>
          {t(isEdit ? "forms.page.updateUser" : "forms.page.createUser")}
        </Title>
        <div className="card w-full bg-base-100 shadow-xl rounded-2xl">
          <div className="card-body">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="flex flex-col gap-5">
                {formFields.map((field) => (
                  <FormField
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    as={field.as}
                    options={field.options}
                  />
                ))}
                <div className="form-control mt-2">
                  <Button className="w-full" variant="success">
                    {t(isEdit ? "forms.buttons.update" : "forms.buttons.create")}
                  </Button>
                </div>
              </form>
            </FormProvider>
            <Button variant="secondary" onClick={() => navigate("/admin/users")}>
              {t("forms.buttons.goBack")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserForm
