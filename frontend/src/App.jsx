import React from "react"
import Router from "./router/Router"
import Navbar from "./components/layout/Navbar"
import "./App.css"

const App = () => {
    return (
        <div data-theme="mytheme" className="bg-base-200 w-dvw h-dvh">
            <Navbar />
            <Router />
        </div>
    )
}

export default App
