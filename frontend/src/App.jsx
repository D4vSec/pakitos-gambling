import React from "react"
import Router from "./router/Router"
import Navbar from "./components/layout/navbar/Navbar"
import Footer from "./components/layout/Footer"
import "./App.css"
import MyComponent from "./components/MyComponent"

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
