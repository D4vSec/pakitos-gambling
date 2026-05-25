import React, { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "@/components/ProtectedRoute"
import Loading from "@/components/Loading"

const AddBalance = lazy(() => import("@/pages/AddBalance"))
const BlackjackGame = lazy(() => import("@/pages/games/BlackjackGame"))
const Error = lazy(() => import("@/pages/Error"))
const Home = lazy(() => import("@/pages/Home"))
const LandingPage = lazy(() => import("@/pages/LandingPage"))
const Login = lazy(() => import("@/pages/Login"))
const Profile = lazy(() => import("@/pages/Profile"))
const Register = lazy(() => import("@/pages/Register"))
const Roulette0Game = lazy(() => import("@/pages/games/Roulette0Game"))
const Roulette00Game = lazy(() => import("@/pages/games/Roulette00Game"))
const SlotsGame = lazy(() => import("@/pages/games/SlotsGame"))
const Slots3x5Game = lazy(() => import("@/pages/games/Slots3x5Game"))
const Slots5x5Game = lazy(() => import("@/pages/games/Slots5x5Game"))
const CapyroadGame = lazy(() => import("@/pages/games/CapyroadGame"))
const AllUsers = lazy(() => import("@/pages/admin/AllUsers"))
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"))
const UserForm = lazy(() => import("@/pages/admin/UserForm"))
const UserDetails = lazy(() => import("@/pages/admin/UserDetails"))
const LogsPage = lazy(() => import("@/pages/admin/LogsPage"))
const AllBets = lazy(() => import("@/pages/admin/AllBets"))
const BetForm = lazy(() => import("@/pages/admin/BetForm"))
const BetDetails = lazy(() => import("@/pages/admin/BetDetails"))
const BetsPage = lazy(() => import("@/pages/bets/BetsPage"))
const BetDetailsPage = lazy(() => import("@/pages/bets/BetDetailsPage"))

const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
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
    </Suspense>
  )
}

export default Router
