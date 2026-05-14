"use strict"

export const AUDIT_FILTER_CONFIG = {
  action: {
    type: "enum",
    options: [
      "ADMIN_ACTION",
      "BALANCE_UPDATED",
      "BET_PLACED",
      "BET_RESULT",
      "GAME_RESULT",
      "USER_REGISTER",
    ],
  },
  user_id: { type: "uuid" },
  ip_address: { type: "text" },
  user_agent: { type: "text" },
  details: { type: "text" },
}
