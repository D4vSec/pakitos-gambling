"use strict"

const API_CONTRACT_FILTERS = {
  audit: {
    fields: {
      id: { type: "uuid", label: "ID" },
      userId: { type: "uuid", label: "User ID" },
      action: {
        type: "enum",
        label: "Action",
        options: [
          "USER_REGISTER",
          "BET_PLACED",
          "BET_RESULT",
          "BALANCE_UPDATED",
          "ADMIN_ACTION",
          "GAME_RESULT",
        ],
      },
      ipAddress: { type: "text", label: "IP Address" },
      userAgent: { type: "text", label: "User Agent" },
      details: { type: "text", label: "Details" },
      fromDate: { type: "date", label: "From Date" },
      toDate: { type: "date", label: "To Date" },
      createdAt: { type: "date", label: "Created At" },
    },
    sortable: [
      "id",
      "userId",
      "action",
      "ipAddress",
      "userAgent",
      "details",
      "createdAt",
    ],
  },
  user: {
    fields: {
      id: { type: "uuid", label: "ID" },
      username: { type: "text", label: "Username" },
      email: { type: "text", label: "Email" },
      role: {
        type: "enum",
        label: "Role",
        options: ["user", "admin"],
      },
      balance: { type: "number", label: "Exact Balance" },
      minBalance: { type: "number", label: "Min Balance" },
      maxBalance: { type: "number", label: "Max Balance" },
      fromDate: { type: "date", label: "Created From" },
      toDate: { type: "date", label: "Created To" },
    },
    sortable: [
      "id",
      "username",
      "email",
      "role",
      "balance",
      "createdAt",
      "updatedAt",
    ],
  },
  transaction: {
    fields: {
      id: { type: "uuid", label: "Transaction ID" },
      type: {
        type: "enum",
        label: "Type",
        options: ["DEPOSIT", "WITHDRAWAL", "BET", "WIN", "BONUS", "REFUND"],
      },
      amount: { type: "number", label: "Exact Amount" },
      minAmount: { type: "number", label: "Min Amount" },
      maxAmount: { type: "number", label: "Max Amount" },
      fromDate: { type: "date", label: "From Date" },
      toDate: { type: "date", label: "To Date" },
    },
    sortable: ["id", "amount", "type", "createdAt"],
  },
}

export default API_CONTRACT_FILTERS
