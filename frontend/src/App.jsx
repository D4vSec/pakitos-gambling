import React from "react"
import Router from "./router/Router"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import "./App.css"

const App = () => {
    return (
        <div data-theme="mytheme" className="bg-base-200">
            <Navbar />
            <Router />
            <Footer />
        </div>
    )
}

export default App
