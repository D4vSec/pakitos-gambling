import React, { useEffect, useState } from "react"
import { useAdmin } from "@/providers/AdminProvider"
import { useParams } from "react-router-dom"
import { useLocale } from "@/providers/LocaleProvider"
import Loading from "@/components/Loading"
import GradientBg from "@/components/layout/GradientBg"
import UserTransactions from "@/components/admin/tables/UserTransactions"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import UserCard from "@/components/admin/components/UserCard"

const UserDetails = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { getUserById } = useAdmin()
  const { id } = useParams()
  const { t } = useLocale()

  useEffect(() => {
    let isActive = true

    const fetchUser = async () => {
      const res = await getUserById(id)

      if (!isActive) return

      setUser(res)
      setLoading(false)
    }

    fetchUser()

    return () => {
      isActive = false
    }
  }, [getUserById, id])

  return loading ? (
    <Loading />
  ) : (
    <GradientBg>
      <div className="flex flex-col gap-6 w-full">
        <div>
          <GoBackBtn />
        </div>
        <div className="flex flex-col gap-6  lg:grid lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:items-start">
          <div className="w-full lg:max-w-sm">
            <UserCard user={user} />
          </div>
          <div className="min-w-0 w-full">
            <h2 className="mb-3 text-2xl font-bold">
              {t("adminPanel.userDetails.transactions.title")}
            </h2>
            <UserTransactions />
          </div>
        </div>
      </div>
    </GradientBg>
  )
}

export default UserDetails
