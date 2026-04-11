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
import ProtectedRoute from "@/components/ProtectedRoute"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/roulette0"
                element={
                    <ProtectedRoute>
                        <Roulette0Game />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/roulette00"
                element={
                    <ProtectedRoute>
                        <Roulette00Game />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/blackjack"
                element={
                    <ProtectedRoute>
                        <BlackjackGame />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/slots"
                element={
                    <ProtectedRoute>
                        <SlotsGame />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/addBalance"
                element={
                    <ProtectedRoute>
                        <AddBalance />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}

export default Router
