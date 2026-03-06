import React from "react"
import Navbar from "@/components/layout/navbar/Navbar"
import Footer from "@/components/layout/Footer"
import Router from "./router/Router"
import Notifications from "./components/notification/Notifications"
import "./App.css"
import SessionProvider from "./providers/SessionProvider"

const App = () => {
    return (
        <SessionProvider>
            <div
                data-theme="mytheme"
                className="bg-base-200 min-h-dvh grid grid-rows-[auto_1fr_auto]"
            >
                <Notifications />
                <Navbar />
                <Router />
                <Footer />
            </div>
        </SessionProvider>
    )
}
export default App
