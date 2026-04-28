import React, { createContext, useContext, useState } from "react"
import useAPI from "@/hooks/useAPI"
import { useSession } from "./SessionProvider"
import { useNotification } from "./NotificationProvider"
import { useLocale } from "./LocaleProvider"

const AdminContext = createContext()

const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([])

  const { get, post, put, destroy, loading } = useAPI()
  const { getAccessToken, getRefreshToken, user } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const getAllUsers = async () => {
    try {
      const res = await get("/api/v1/user", {
        headers: {
          "x-refresh-token": getRefreshToken(),
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      console.log(res)
      if (res.code) {
        throw new Error(res.code || "Error al obtener usuarios")
      }

      setUsers(res)
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

      // TODO: Refrescarlo sin llamar
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

      getAllUsers()

      addNotification("User deleted successfully", "success")
    } catch (error) {
      console.log(error)
      addNotification(t(`message.error.${error.message}`), "error", {
        duration: 10000,
      })
    }
  }

  const deleteModal = (userId) => {
    addNotification("Sure wanna delete user?", "modal", {
      onAccept: () => deleteUser(userId),
      acceptLabel: "Sure, 1 gambler less",
      cancelLabel: "No, I regret my decision",
    })
  }

  // const createuser = async (data) => {}

  const value = {
    users,
    loading,
    getAllUsers,
    updateUser,
    deleteUser,
    deleteModal,
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
