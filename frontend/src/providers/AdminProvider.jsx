import React, { createContext, useContext, useState } from "react"
import useAPI from "@/hooks/useAPI"
import { useSession } from "./SessionProvider"
import { useNotification } from "./NotificationProvider"
import { useLocale } from "./LocaleProvider"

const AdminContext = createContext()

// TODO: Reducir peticiones a ser posible
const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const { get, put, destroy, loading } = useAPI()
  const { getAccessToken, getRefreshToken, user } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const getAllUsers = async (options = {}) => {
    try {
      const { page = 1, limit = 20 } = options
      const url = `/api/v1/user?page=${page}&limit=${limit}`

      const res = await get(url, {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })

      if (res.code) {
        throw new Error(res.code || "Error al obtener usuarios")
      }
      console.log(res)
      setUsers(res)
      return res
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const getUserById = async (userId) => {
    try {
      const res = await get(`/api/v1/user/${userId}`, {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })

      if (res.code) {
        throw new Error(res.code || "Error al obtener usuarios")
      }

      return res
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const updateUser = async (userId, userData) => {
    try {
      console.log("userData", userData)
      const res = await put(`/api/v1/user/${userId}`, {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: userData,
      })
      console.log("up", res)

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
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      console.log("del", res)

      if (res.code !== "SUCCESS") {
        throw new Error(res.code || "Error al borrar usuario")
      }

      addNotification("User deleted successfully", "success")

      getAllUsers()
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error", {
        duration: 10000,
      })
    }
  }

  const deleteModal = (userId) => {
    if (userId === user?.id) {
      addNotification("You can't delete yourself, dummy", "warning")
    } else {
      addNotification("Sure wanna delete user?", "modal", {
        onAccept: () => deleteUser(userId),
        acceptLabel: "Sure, 1 gambler less",
        cancelLabel: "No, I regret my decision",
      })
    }
  }

  const getTransactionsById = async (userId, options = {}) => {
    try {
      const { page = 1, limit = 20 } = options
      const url = `/api/v1/user/${userId}/transactions?page=${page}&limit=${limit}`
      let res = await get(url, {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })

      console.log(res)

      if (res.code) {
        throw new Error(res.code || "Error al obtener usuarios")
      }

      return res
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  const getLogs = async (options = {}) => {
    try {
      const { page = 1, limit = 20 } = options
      const url = `/api/v1/audit?page=${page}&limit=${limit}`
      let res = await get(url, {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })

      console.log(res)

      if (res.code) {
        throw new Error(res.code || "Error al obtener usuarios")
      }

      return res
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    }
  }

  // const createuser = async (data) => {}

  const value = {
    users,
    loading,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    deleteModal,
    getTransactionsById,
    getLogs,
  }

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
