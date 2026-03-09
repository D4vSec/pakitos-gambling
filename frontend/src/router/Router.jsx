import React from "react"
import { Routes, Route } from "react-router-dom"
import Error from "../pages/Error"
import Home from "../pages/Home"
import LandingPage from "../pages/LandingPage"
import Login from "../pages/Login"
import Register from "../pages/Register"
import RouletteGame from "@/pages/games/RouletteGame"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/roulette" element={<RouletteGame />} />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}

export default Router
