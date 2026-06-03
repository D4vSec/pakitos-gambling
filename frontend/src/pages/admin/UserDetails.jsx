import React, { useEffect, useState } from "react"
import { useAdmin } from "@/providers/AdminProvider"
import { useParams } from "react-router-dom"
import { useLocale } from "@/providers/LocaleProvider"
import Loading from "@/components/Loading"
import UserTransactions from "@/components/admin/tables/UserTransactions"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import UserCard from "@/components/admin/components/UserCard"
import UserSessions from "@/components/profile/UserSessions"
import { IconCreditCard } from "@tabler/icons-react"

const UserDetails = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { getUserById } = useAdmin()
  const { id } = useParams()
  const { t } = useLocale()

  useEffect(() => {
    let isActive = true

    const fetchUser = async () => {
      setLoading(true)
      const res = await getUserById(id)

      if (!isActive) return

      setUser(res || null)
      setLoading(false)
    }

    fetchUser()

    return () => {
      isActive = false
    }
  }, [id])

  return loading ? (
    <Loading clear />
  ) : (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <GoBackBtn />
      </div>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:items-start">
        <div className="w-full lg:max-w-sm">
          <UserCard user={user} />
        </div>
        {user ? (
          <UserSessions userId={id} shadow={false} className="min-w-0 w-full" />
        ) : (
          <div className="card bg-base-100 p-6 min-w-0 w-full">
            <h2 className="mb-3 text-xl sm:text-2xl font-bold">
              {t("adminPanel.userDetails.sessions.title")}
            </h2>
            <h3 className="text-center text-md sm:lg font-semibold">{t("ui.tables.noData")}</h3>
          </div>
        )}
        <div className="card bg-base-100 p-6 min-w-0 w-full lg:col-span-2">
          <h2 className="mb-3 text-xl card-title">
            <IconCreditCard />
            {t("adminPanel.userDetails.transactions.title")}
          </h2>
          {user ? (
            <UserTransactions />
          ) : (
            <h3 className="text-center text-md sm:lg font-semibold">{t("ui.tables.noData")}</h3>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetails
