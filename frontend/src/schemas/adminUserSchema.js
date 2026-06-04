import { z } from "zod"
import { passwordSchema } from "./passwordSchema"

const baseUserFields = {
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(25, "Username must be at most 25 characters"),
  email: z.email("Invalid email address"),
  role: z.enum(["user", "admin"]).default("user"),
  balance: z.coerce.number().min(0, "Balance cannot be negative"),
}

export const createAdminUserSchema = z
  .object({
    ...baseUserFields,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )

export const updateAdminUserSchema = z
  .object({
    username: baseUserFields.username,
    email: baseUserFields.email,
    role: baseUserFields.role,
    password: passwordSchema.optional().or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )
