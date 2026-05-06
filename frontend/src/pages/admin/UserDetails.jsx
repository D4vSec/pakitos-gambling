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

  const loadUser = async () => {
    setLoading(true)
    const res = await getUserById(id)
    setUser(res)
    setLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [id])

  return loading ? (
    <Loading />
  ) : (
    <GradientBg>
      <div className="flex flex-col gap-6 w-8/10">
        <div>
          <GoBackBtn />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr] w-full">
          <UserCard user={user} />
          <div className="bg-accent rounded-lg flex items-center justify-center text-white">
            Future chart
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-2">Transactions</h2>
            <UserTransactions />
          </div>
        </div>
      </div>
    </GradientBg>
  )
}

export default UserDetails
