"use strict"

import { z } from "zod"

export const addBalanceSchema = z.object({
  amount: z.coerce
    .number()
    .positive()
    .min(0.01, "pages.addBalance.min")
    .max(99999999999.99, "pages.addBalance.max"),
})
