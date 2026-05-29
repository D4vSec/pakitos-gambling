import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import useAPI from "@/hooks/useAPI"
import { useSession } from "./SessionProvider"
import { useNotification } from "./NotificationProvider"
import { useLocale } from "./LocaleProvider"

const AdminContext = createContext()

const buildQueryParams = (options = {}) => {
  const { page = 1, limit = 20, ...filters } = options
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  Object.keys(filters).forEach((key) => {
    if (
      filters[key] !== undefined &&
      filters[key] !== null &&
      filters[key] !== ""
    ) {
      queryParams.append(key, filters[key])
    }
  })

  return queryParams
}

// TODO: Reducir peticiones a ser posible
const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [bets, setBets] = useState([])
  const { get, post, put, destroy, loading } = useAPI()
  const { getAccessToken, getRefreshToken, user } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const buildHeaders = useCallback(() => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    return {
      ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }
  }, [getAccessToken, getRefreshToken])

  const getAllUsers = useCallback(
    async (options = {}) => {
      try {
        const queryParams = buildQueryParams(options)
        const url = `/api/v1/user?${queryParams.toString()}`

        const res = await get(url, {
          headers: buildHeaders(),
        })

        if (res.code) {
          throw new Error(res.code || "Error al obtener usuarios")
        }

        setUsers(res)
        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
      }
    },
    [addNotification, buildHeaders, buildQueryParams, get, t],
  )

  const getUserById = useCallback(
    async (userId) => {
      try {
        const res = await get(`/api/v1/user/${userId}`, {
          headers: buildHeaders(),
        })

        if (res.code) {
          throw new Error(res.code || "Error al obtener usuarios")
        }

        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
      }
    },
    [addNotification, buildHeaders, get, t],
  )

  const updateUser = async (userId, userData) => {
    try {
      const res = await put(`/api/v1/user/${userId}`, {
        headers: buildHeaders(),
        body: userData,
      })

      if (res.code !== "SUCCESS") {
        throw new Error(res.code || "Error al obtener usuarios")
      }

      getAllUsers()

      addNotification("User updated successfully", "success")
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const deleteUser = async (userId) => {
    try {
      const res = await destroy(`/api/v1/user/${userId}`, {
        headers: buildHeaders(),
      })

      if (res.code !== "SUCCESS") {
        throw new Error(res.code || "Error al borrar usuario")
      }

      addNotification("User deleted successfully", "success")
      return true
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error", {
        duration: 10000,
      })
      return false
    }
  }

  const deleteModal = (userId, onAfterSuccess) => {
    if (userId === user?.id) {
      addNotification(t("message.warning.deleteYourself"), "warning")
    } else {
      addNotification(t("message.modal.deleteUser.title"), "modal", {
        onAccept: async () => {
          const deleted = await deleteUser(userId)
          if (deleted) {
            onAfterSuccess?.()
          }
        },
        acceptLabel: t("message.modal.deleteUser.accept"),
        cancelLabel: t("message.modal.deleteUser.cancel"),
      })
    }
  }

  const getTransactionsById = useCallback(
    async (userId, options = {}) => {
      try {
        const queryParams = buildQueryParams(options)
        const url = `/api/v1/user/${userId}/transactions?${queryParams.toString()}`

        const res = await get(url, {
          headers: buildHeaders(),
        })

        if (res.code) {
          throw new Error(res.code || "Error al obtener transacciones")
        }

        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
      }
    },
    [addNotification, buildHeaders, get, t],
  )

  const getLogs = useCallback(
    async (options = {}) => {
      try {
        const queryParams = buildQueryParams(options)
        const url = `/api/v1/audit?${queryParams.toString()}`
        const res = await get(url, {
          headers: buildHeaders(),
        })

        if (res.code) {
          throw new Error(res.code || "Error al obtener logs")
        }

        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
      }
    },
    [addNotification, buildHeaders, get, t],
  )

  const getAdminBets = useCallback(
    async (options = {}) => {
      try {
        const queryParams = buildQueryParams(options)
        const res = await get(`/api/v1/bets/admin?${queryParams.toString()}`, {
          headers: buildHeaders(),
        })

        if (res.code) {
          throw new Error(res.code || "Error al obtener apuestas")
        }

        setBets(res?.bets || [])
        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
        return null
      }
    },
    [addNotification, buildHeaders, get, t],
  )

  const getAdminBet = useCallback(
    async (betId) => {
      try {
        const res = await get(`/api/v1/bets/admin/${betId}`, {
          headers: buildHeaders(),
        })

        if (res.code) {
          throw new Error(res.code || "Error al obtener apuesta")
        }

        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
        return null
      }
    },
    [addNotification, buildHeaders, get, t],
  )

  const createBet = useCallback(
    async (betData) => {
      try {
        const res = await post("/api/v1/bets/admin", {
          headers: buildHeaders(),
          body: betData,
        })

        if (res?.code) {
          throw new Error(res.code || "Error al crear apuesta")
        }

        addNotification(t("message.success.BET_CREATED"), "success")
        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
        return null
      }
    },
    [addNotification, buildHeaders, post, t],
  )

  const updateBet = useCallback(
    async (betId, betData) => {
      try {
        const res = await put(`/api/v1/bets/${betId}`, {
          headers: buildHeaders(),
          body: betData,
        })

        if (res.code !== "SUCCESS") {
          throw new Error(res.code || "Error al actualizar apuesta")
        }

        addNotification(t("message.success.BET_UPDATED"), "success")
        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error", {
          duration: 10000,
        })
        return null
      }
    },
    [addNotification, buildHeaders, put, t],
  )

  const deleteBet = useCallback(
    async (betId) => {
      try {
        const res = await destroy(`/api/v1/bets/${betId}`, {
          headers: buildHeaders(),
        })

        if (res.code !== "SUCCESS") {
          throw new Error(res.code || "Error al eliminar apuesta")
        }

        addNotification(t("message.success.BET_DELETED"), "success")
        return true
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error", {
          duration: 10000,
        })
        return false
      }
    },
    [addNotification, buildHeaders, destroy, t],
  )

  const closeBet = useCallback(
    async (betId) => {
      try {
        const res = await post(`/api/v1/bets/admin/${betId}/close`, {
          headers: buildHeaders(),
        })

        if (res.code !== "SUCCESS") {
          throw new Error(res.code || "Error al cerrar apuesta")
        }

        addNotification(t("message.success.BET_CLOSED_BY_ADMIN"), "success")
        return true
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
        return false
      }
    },
    [addNotification, buildHeaders, post, t],
  )

  const getBetSettlementPreview = useCallback(
    async (betId, winningOptionId) => {
      try {
        const res = await post(
          `/api/v1/bets/admin/${betId}/settlement-preview`,
          {
            headers: buildHeaders(),
            body: { winningOptionId },
          },
        )

        if (res.code) {
          throw new Error(res.code || "Error al obtener preview")
        }

        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
        return null
      }
    },
    [addNotification, buildHeaders, post, t],
  )

  const settleBet = useCallback(
    async (betId, winningOptionId) => {
      try {
        const res = await post(`/api/v1/bets/admin/${betId}/settle`, {
          headers: buildHeaders(),
          body: { winningOptionId },
        })

        if (res.code) {
          throw new Error(res.code || "Error al liquidar apuesta")
        }

        addNotification(t("message.success.BET_SETTLED"), "success")
        return res
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
        return null
      }
    },
    [addNotification, buildHeaders, post, t],
  )

  const deleteBetModal = useCallback(
    (betId, betLabel, onAfterSuccess) => {
      addNotification(
        t("message.modal.deleteBet.title", { label: betLabel }),
        "modal",
        {
          onAccept: async () => {
            const deleted = await deleteBet(betId)
            if (deleted) {
              onAfterSuccess?.()
            }
          },
          acceptLabel: t("message.modal.deleteBet.accept"),
          cancelLabel: t("message.modal.deleteBet.cancel"),
        },
      )
    },
    [addNotification, deleteBet, t],
  )

  const closeBetModal = useCallback(
    (betId, betLabel, onAfterSuccess) => {
      addNotification(
        t("message.modal.closeBet.title", { label: betLabel }),
        "modal",
        {
          onAccept: async () => {
            const closed = await closeBet(betId)
            if (closed) {
              onAfterSuccess?.()
            }
          },
          acceptLabel: t("message.modal.closeBet.accept"),
          cancelLabel: t("message.modal.closeBet.cancel"),
        },
      )
    },
    [addNotification, closeBet, t],
  )

  const settleBetModal = useCallback(
    (betId, betLabel, winningOptionLabel, winningOptionId, onAfterSuccess) => {
      addNotification(
        t("message.modal.settleBet.title", {
          label: betLabel,
          option: winningOptionLabel,
        }),
        "modal",
        {
          onAccept: async () => {
            const settlement = await settleBet(betId, winningOptionId)
            if (settlement) {
              onAfterSuccess?.(settlement)
            }
          },
          acceptLabel: t("message.modal.settleBet.accept"),
          cancelLabel: t("message.modal.settleBet.cancel"),
        },
      )
    },
    [addNotification, settleBet, t],
  )

  const value = useMemo(
    () => ({
      bets,
      users,
      loading,
      getAllUsers,
      getUserById,
      updateUser,
      deleteUser,
      deleteModal,
      getTransactionsById,
      getLogs,
      getAdminBets,
      getAdminBet,
      createBet,
      updateBet,
      deleteBet,
      closeBet,
      getBetSettlementPreview,
      settleBet,
      deleteBetModal,
      closeBetModal,
      settleBetModal,
    }),
    [
      bets,
      users,
      loading,
      getAllUsers,
      getUserById,
      updateUser,
      deleteUser,
      deleteModal,
      getTransactionsById,
      getLogs,
      getAdminBets,
      getAdminBet,
      createBet,
      updateBet,
      deleteBet,
      closeBet,
      getBetSettlementPreview,
      settleBet,
      deleteBetModal,
      closeBetModal,
      settleBetModal,
    ],
  )

  return <AdminContext value={value}>{children}</AdminContext>
}

export default AdminProvider

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("Provider outside scope")
  }
  return context
}
