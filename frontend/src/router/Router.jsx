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
import Roulette0Game from "@/pages/games/Roulette0Game"
import Roulette00Game from "@/pages/games/Roulette00Game"
import SlotsGame from "@/pages/games/SlotsGame"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="/roulette0" element={<Roulette0Game />} />
            <Route path="/roulette00" element={<Roulette00Game />} />
            <Route path="/blackjack" element={<BlackjackGame />} />
            <Route path="/slots" element={<SlotsGame />} />
            <Route path="/addBalance" element={<AddBalance />} />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}

export default Router
