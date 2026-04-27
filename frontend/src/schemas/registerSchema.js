"use strict"

import { z } from "zod"
import { passwordSchema } from "./passwordSchema"

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: "general.form.schema.min3Characters" })
      .max(25, { error: "general.form.schema.maxCharacters" }),

    email: z.email({ error: "general.form.schema.email" }),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "general.form.schema.confirmPasswordMatch",
    path: ["confirmPassword"],
  })
