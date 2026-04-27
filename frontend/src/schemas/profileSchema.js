"use strict"

import { z } from "zod"
import { passwordSchema } from "./passwordSchema"

export const profileSchema = z
  .object({
    username: z.string().min(1, { error: "general.form.username.required" }),

    email: z.email({ error: "general.form.email.pattern" }),

    password: passwordSchema.optional().or(z.literal("")),

    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password) return true
      return data.password === data.confirmPassword
    },
    {
      error: "general.form.password.pattern",
      path: ["confirmPassword"],
    },
  )
