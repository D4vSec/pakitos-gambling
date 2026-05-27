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
    optionLabelPrefix: "adminPanel.logs.table.badges",
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
    optionLabelPrefix: "forms.fields.role.options",
  },
  balance: { type: "text" },
}

export const PUBLIC_BET_FILTER_CONFIG = {
  name: {
    type: "text",
    labelKey: "adminPanel.bets.table.name",
  },
  status: {
    type: "enum",
    options: ["open", "closed"],
    labelKey: "pages.bets.filters.status",
    optionLabelPrefix: "pages.bets.status",
  },
}

export const ADMIN_BET_FILTER_CONFIG = {
  label: {
    type: "text",
    labelKey: "adminPanel.bets.table.label",
  },
  status: {
    type: "enum",
    options: ["open", "closed"],
    labelKey: "adminPanel.bets.table.status",
    optionLabelPrefix: "pages.bets.status",
  },
  optionsCount: {
    type: "text",
    labelKey: "adminPanel.bets.table.options",
  },
}

export const TRANSACTION_FILTER_CONFIG = {
  type: {
    type: "enum",
    options: ["BET", "BONUS", "DEPOSIT", "REFUND", "WIN", "WITHDRAWAL"],
    optionLabelPrefix: "adminPanel.userDetails.transactions.table.badges",
  },
  amount: {
    type: "text",
  },
}
