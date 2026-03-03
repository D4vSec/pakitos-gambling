import React from "react"

const Notification = ({ notification }) => {
    const baseClasses = "px-4 py-3 rounded-md max-w-md font-bold text-white z-50 shadow-md"
    const typeClasses = {
        success: "bg-green-700 border-2 border-green-500",
        error: "bg-red-700 border-2 border-red-500",
        info: "bg-sky-700 border-2 border-sky-500",
    }

    return (
        <p className={`${baseClasses} ${typeClasses[notification.type] || ""} z-1000`}>
            {notification.message}
        </p>
    )
}

export default Notification
