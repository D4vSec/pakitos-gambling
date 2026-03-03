import React from "react"
import InfoSVG from "../svg/InfoSVG"
import CheckSVG from "../svg/CheckSVG"
import AlertTriangle from "../svg/AlertTriangle"
import CircleXSVG from "../svg/CircleXSVG"

const Notification = ({ notification }) => {
    const typeClasses = {
        info: "alert-info",
        success: "alert-success",
        warning: "alert-warning",
        error: "alert-error",
    }

    const svg = {
        info: <InfoSVG />,
        success: <CheckSVG />,
        warning: <AlertTriangle />,
        error: <CircleXSVG />,
    }

    return (
        <div
            className={`alert alert-horizontal ${typeClasses[notification.type] || ""} shadow-lg max-w-md`}
        >
            {svg[notification.type]}
            <span>{notification.message}</span>
        </div>
    )
}

export default Notification
