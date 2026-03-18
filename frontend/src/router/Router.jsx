import React from "react"
import { Routes, Route } from "react-router-dom"
import AddBalance from "@/pages/AddBalance"
import BlackjackGame from "@/pages/games/BlackjackGame"
import Error from "../pages/Error"
import Home from "../pages/Home"
import LandingPage from "../pages/LandingPage"
import Login from "../pages/Login"
import Profile from "@/pages/Profile"
import Register from "../pages/Register"
import RouletteGame from "@/pages/games/RouletteGame"
import SlotsGame from "@/pages/games/SlotsGame"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="/roulette" element={<RouletteGame />} />
            <Route path="/blackjack" element={<BlackjackGame />} />
            <Route path="/slots" element={<SlotsGame />} />
            <Route path="/addBalance" element={<AddBalance />} />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}

export default Router
