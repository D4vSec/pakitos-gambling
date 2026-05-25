import { z } from "zod"

const betOptionSchema = z.object({
  label: z.string().trim().min(1, "forms.fields.betOptionLabel.required"),
  odd: z.coerce.number().positive("forms.fields.betOptionOdd.positive"),
})

export const betSchema = z.object({
  label: z
    .string()
    .trim()
    .min(3, "forms.fields.betLabel.minLength")
    .max(120, "forms.fields.betLabel.maxLength"),
  ends_at: z
    .string()
    .min(1, "forms.fields.endsAt.required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "forms.fields.endsAt.invalid",
    }),
  options: z
    .array(betOptionSchema)
    .min(2, "forms.fields.betOptions.minItems")
    .max(20, "forms.fields.betOptions.maxItems"),
})
