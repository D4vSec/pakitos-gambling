import React, { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import GradientBg from "@/components/layout/GradientBg"
import { useAdmin } from "@/providers/AdminProvider"
import { useParams } from "react-router-dom"
import UserTransactions from "@/components/admin/tables/UserTransactions"

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
      <div className="grid gap-6 w-8/10 grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr]">
        <div className="card bg-base-100 shadow-sm w-full">
          <div className="card-body">
            {user ? (
              <>
                <h2 className="card-title">User Details</h2>
                <p>
                  <strong>Name:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <p>
                  <strong>Balance:</strong> {user.balance}
                </p>
              </>
            ) : (
              <h3 className="text-center text-lg">User not found</h3>
            )}
          </div>
        </div>

        <div className="bg-accent  rounded-lg flex items-center justify-center text-white">
          Future chart
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-2">Transactions</h2>
          <UserTransactions />
        </div>
      </div>
    </GradientBg>
  )
}

export default UserDetails
