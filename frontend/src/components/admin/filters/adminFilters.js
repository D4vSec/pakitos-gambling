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
  details: { type: "text" },
  ip_address: { type: "text" },
  user_agent: { type: "text" },
}

export const USER_FILTER_CONFIG = {
  username: { type: "text" },
  email: { type: "text" },
  role: {
    type: "enum",
    options: ["admin", "user"],
  },
  balance: { type: "text" },
}

export const TRANSACTION_FILTER_CONFIG = {
  type: {
    type: "enum",
    options: ["BET", "BONUS", "DEPOSIT", "REFUND", "WIN", "WITHDRAWAL"],
  },
  amount: {
    type: "text",
  },
}
