"use strict"

import { z } from "zod"
import { passwordSchema } from "./passwordSchema"

const profileBaseSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { error: "forms.fields.username.required" })
    .min(3, { error: "forms.fields.username.minLength" })
    .max(25, { error: "forms.fields.username.maxLength" }),

  email: z
    .string()
    .trim()
    .min(1, { error: "forms.fields.email.required" })
    .email({ error: "forms.fields.email.pattern" }),

  password: passwordSchema.optional().or(z.literal("")),

  confirmPassword: z.string().optional(),
})

export const profileSchema = profileBaseSchema.refine(
  (data) => {
    if (!data.password) return true
    return data.password === data.confirmPassword
  },
  {
    error: "forms.fields.confirmPassword.match",
    path: ["confirmPassword"],
  },
)

export const profileInfoSchema = profileBaseSchema.pick({
  username: true,
  email: true,
})

export const profilePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { error: "forms.fields.password.currentRequired" }),
    newPassword: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { error: "forms.fields.confirmPassword.required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "forms.fields.confirmPassword.match",
    path: ["confirmPassword"],
  })
