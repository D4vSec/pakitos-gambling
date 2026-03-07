import Button from "@/components/buttons/Button"
import React from "react"
import { useSession } from "@/providers/SessionProvider"
import BitcoinSVG from "@/components/svg/BitcoinSVG"

const UserBalance = () => {
    const { user } = useSession()
    return (
        <Button variant="neutral" className="text-bold">
            {user?.balance ? `${user?.balance}` : "0,00"}
            <BitcoinSVG />
        </Button>
    )
}

export default UserBalance
