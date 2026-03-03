import React from "react"
import { LoginExample } from "@/components/ReusableForm"
import { RegisterExample } from "@/components/ReusableForm"

const Register = () => {
    return (
        <div>
            Register
            <div className="flex gap-10">
                {LoginExample()}
                {RegisterExample()}
            </div>
        </div>
    )
}

export default Register
