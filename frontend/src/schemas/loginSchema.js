"use strict"

import { z } from "zod"
import { passwordSchema } from "./passwordSchema"

export const loginSchema = z.object({
  email: z.email({ error: "forms.schema.email" }),
  password: passwordSchema,
})
