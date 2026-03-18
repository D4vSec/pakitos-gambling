import React from "react"
import InfoSVG from "../svg/InfoSVG"
import CheckSVG from "../svg/CheckSVG"
import AlertTriangleSVG from "../svg/AlertTriangleSVG"
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
        warning: <AlertTriangleSVG />,
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
