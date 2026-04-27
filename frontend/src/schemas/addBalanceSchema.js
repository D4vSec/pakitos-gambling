"use strict"

import { z } from "zod"

export const addBalanceSchema = z.object({
  amount: z.coerce
    .number()
    .positive()
    .min(0.01, "general.addBalance.min")
    .max(99999999999.99, "general.addBalance.max"),
})
