import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "@/components/ProtectedRoute"
import AddBalance from "@/pages/AddBalance"
import BlackjackGame from "@/pages/games/BlackjackGame"
import Error from "@/pages/Error"
import Home from "@/pages/Home"
import LandingPage from "@/pages/LandingPage"
import Login from "@/pages/Login"
import Profile from "@/pages/Profile"
import Register from "@/pages/Register"
import Roulette0Game from "@/pages/games/Roulette0Game"
import Roulette00Game from "@/pages/games/Roulette00Game"
import SlotsGame from "@/pages/games/SlotsGame"
import Slots3x5Game from "@/pages/games/Slots3x5Game"
import Slots5x5Game from "@/pages/games/Slots5x5Game"
import CapyroadGame from "@/pages/games/CapyroadGame"
import AllUsers from "@/pages/admin/AllUsers"
import AdminLayout from "@/pages/admin/AdminLayout"
import UserForm from "@/pages/admin/UserForm"
import UserDetails from "@/pages/admin/UserDetails"
import LogsPage from "@/pages/admin/LogsPage"
import AllBets from "@/pages/admin/AllBets"
import BetForm from "@/pages/admin/BetForm"
import BetDetails from "@/pages/admin/BetDetails"
import BetsPage from "@/pages/bets/BetsPage"
import BetDetailsPage from "@/pages/bets/BetDetailsPage"

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
        path="/addBalance"
        element={
          <ProtectedRoute>
            <AddBalance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<AllUsers />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users/create" element={<UserForm />} />
        <Route path="users/edit/:id" element={<UserForm />} />
        <Route path="bets" element={<AllBets />} />
        <Route path="bets/:id" element={<BetDetails />} />
        <Route path="bets/create" element={<BetForm />} />
        <Route path="bets/edit/:id" element={<BetForm />} />
        <Route path="logs" element={<LogsPage />} />
      </Route>
      <Route
        path="/bets"
        element={
          <ProtectedRoute>
            <BetsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bets/:betId"
        element={
          <ProtectedRoute>
            <BetDetailsPage />
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
        path="/slots3x5"
        element={
          <ProtectedRoute>
            <Slots3x5Game />
          </ProtectedRoute>
        }
      />
      <Route
        path="/slots5x5"
        element={
          <ProtectedRoute>
            <Slots5x5Game />
          </ProtectedRoute>
        }
      />
      <Route
        path="/capyroad"
        element={
          <ProtectedRoute>
            <CapyroadGame />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Error />} />
    </Routes>
  )
}

export default Router
