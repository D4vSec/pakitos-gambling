import React, { useState } from "react"
import Notifications from "@/components/notification/Notifications.jsx"
import Button from "@/components/buttons/Button.jsx"

const TestNotifications = () => {
    const [counter, setCounter] = useState(1)

    return (
        <div>
            {({ addNotification }) => (
                <div className="p-8 flex flex-col gap-4">
                    <h1 className="text-2xl font-bold mb-4">Notification Test</h1>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="info"
                            onClick={() => {
                                addNotification(`This is an info notification #${counter}`, "info")
                                setCounter(counter + 1)
                            }}
                        >
                            Show Info
                        </Button>

                        <Button
                            variant="success"
                            onClick={() => {
                                addNotification(
                                    `This is a success notification #${counter}`,
                                    "success",
                                )
                                setCounter(counter + 1)
                            }}
                        >
                            Show Success
                        </Button>

                        <Button
                            variant="error"
                            onClick={() => {
                                addNotification(
                                    `This is an error notification #${counter}`,
                                    "error",
                                )
                                setCounter(counter + 1)
                            }}
                        >
                            Show Error
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => {
                                addNotification(
                                    `Do you want to proceed? #${counter}`,
                                    "modal",
                                    undefined,
                                    {
                                        onAceptar: () => alert("Accepted!"),
                                    },
                                )
                                setCounter(counter + 1)
                            }}
                        >
                            Show Modal
                        </Button>
                    </div>

                    <Notifications />
                </div>
            )}
        </div>
    )
}

export default TestNotifications
