"use strict"

import { z } from "zod"
import { passwordSchema } from "./passwordSchema"

export const profileSchema = z
  .object({
    username: z.string().min(1, { error: "forms.fields.username.required" }),

    email: z.email({ error: "forms.email.pattern" }),

    password: passwordSchema.optional().or(z.literal("")),

    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password) return true
      return data.password === data.confirmPassword
    },
    {
      error: "forms.fields.password.pattern",
      path: ["confirmPassword"],
    },
  )
