"use strict"

import { z } from "zod"

export const addBalanceSchema = z.object({
  amount: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    z
      .coerce
      .number({ error: "pages.addBalance.required" })
      .min(0.01, { error: "pages.addBalance.min" })
      .max(99999999999.99, { error: "pages.addBalance.max" }),
  ),
})
