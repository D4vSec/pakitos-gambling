import React, { useEffect, useRef, useState } from "react"
import Button from "@/components/buttons/Button"
import { useSession } from "@/providers/SessionProvider"
import BitcoinSVG from "@/components/svg/BitcoinSVG"

const UserBalance = () => {
  const { user } = useSession()

  const balance = Number(user?.balance ?? 0)

  const prevBalanceRef = useRef(balance)
  const [changeType, setChangeType] = useState(null)

  useEffect(() => {
    const prev = prevBalanceRef.current

    if (balance > prev) {
      setChangeType("up")
    } else if (balance < prev) {
      setChangeType("down")
    }

    prevBalanceRef.current = balance

    if (balance !== prev) {
      const timeout = setTimeout(() => {
        setChangeType(null)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [balance])

  const bgClass =
    changeType === "up"
      ? "bg-green-500 text-white"
      : changeType === "down"
        ? "bg-red-500 text-white"
        : ""

  return (
    <Button variant="neutral" className={`text-bold transition-all ${bgClass}`}>
      {balance.toFixed(2)}
      <BitcoinSVG />
    </Button>
  )
}

export default UserBalance
