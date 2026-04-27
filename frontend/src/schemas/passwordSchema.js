"use strict"

import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "general.form.schema.min8Characters")
  .max(20, "general.form.schema.maxCharacters")
  .regex(/[a-z]/, "general.form.schema.needLowercase")
  .regex(/[A-Z]/, "general.form.schema.needUppercase")
  .regex(/(\d|[!@#$%^&*])/, "general.form.schema.needNumberOrSpecial")
