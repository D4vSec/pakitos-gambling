"use strict"

import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "forms.schema.min8Characters")
  .max(20, "forms.schema.maxCharacters")
  .regex(/[a-z]/, "forms.schema.needLowercase")
  .regex(/[A-Z]/, "forms.schema.needUppercase")
  .regex(/(\d|[!@#$%^&*])/, "forms.schema.needNumberOrSpecial")
