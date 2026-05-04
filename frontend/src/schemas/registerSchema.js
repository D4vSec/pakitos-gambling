"use strict"

import { z } from "zod"
import { passwordSchema } from "./passwordSchema"

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: "forms.schema.min3Characters" })
      .max(25, { error: "forms.schema.maxCharacters" }),

    email: z.email({ error: "forms.schema.email" }),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "forms.schema.confirmPasswordMatch",
    path: ["confirmPassword"],
  })
