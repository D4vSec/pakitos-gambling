import Button from "@/components/buttons/Button"
import React from "react"
import { useSession } from "@/providers/SessionProvider"

const UserBalance = () => {
    const { user } = useSession()
    return (
        <Button variant="neutral" className="text-bold">
            {user?.balance ? `${user?.balance} @` : "No money :/"}
        </Button>
    )
}

export default UserBalance
