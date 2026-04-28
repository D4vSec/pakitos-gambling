import React, { useMemo, useEffect, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useNavigate } from "react-router-dom"
import { useLocale } from "@/providers/LocaleProvider"
import FormField from "@/components/forms/FormField"
import Title from "@/components/Title"
import Button from "@/components/buttons/Button"
import GradientBg from "@/components/layout/GradientBg"
import { useAdmin } from "@/providers/AdminProvider"
import { userSchema } from "@/schemas/userSchemas"
import { useSession } from "@/providers/SessionProvider"

import Loading from "@/components/Loading"

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register } = useSession()
  const { t } = useLocale()
  const { users, updateUser } = useAdmin()
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
        label: "Username",
        placeholder: "Username",
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "Email",
      },
    ]

    const passwordFields = !isEdit
      ? [
          {
            name: "password",
            type: "password",
            label: "Password",
            placeholder: "Enter password",
          },
          {
            name: "confirmPassword",
            type: "password",
            label: "Confirm Password",
            placeholder: "Confirm password",
          },
        ]
      : [
          {
            name: "password",
            type: "password",
            label: "New Password (optional)",
            placeholder: "Leave empty to keep current password",
          },
          {
            name: "confirmPassword",
            type: "password",
            label: "Confirm Password",
            placeholder: "Confirm new password",
          },
        ]

    const rest = [
      {
        name: "balance",
        type: "number",
        label: "Balance",
        placeholder: "0.00",
      },
      {
        name: "role",
        type: "text",
        label: "Role",
        placeholder: "Select a role",
        as: "select",
        options: [
          { label: "User", value: "user" },
          { label: "Admin", value: "admin" },
        ],
      },
    ]

    return [...baseFields, ...passwordFields, ...rest]
  }, [isEdit])

  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }

    if (!users || users.length === 0) {
      setLoading(true)
      return
    }

    const user = users.find((u) => u.id === id)

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
    <GradientBg>
      <Title>{isEdit ? "Edit User" : "Create User"}</Title>
      <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl">
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
                  {isEdit ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </FormProvider>
          <Button variant="secondary" onClick={() => navigate("/admin/users")}>
            {isEdit ? "Go back" : "Cancel"}
          </Button>
        </div>
      </div>
    </GradientBg>
  )
}

export default UserForm
