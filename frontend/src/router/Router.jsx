import React from "react"
import { Routes, Route } from "react-router-dom"
import Error from "../pages/Error"
import Home from "../pages/Home"
import LandingPage from "../pages/LandingPage"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}

export default Router
