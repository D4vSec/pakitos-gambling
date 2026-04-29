import React, { useEffect, useState } from "react"
import Navbar from "@/components/layout/navbar/Navbar"
import Footer from "@/components/layout/Footer"
import Router from "./router/Router"
import Notifications from "./components/notification/Notifications"
import SessionProvider from "./providers/SessionProvider"
import { useLocale } from "./providers/LocaleProvider"
import Loading from "./components/Loading"
import "./App.css"

// TODO: Añadir carga de páginas lazy
// TODo: Añadir loading mientras que se inicia y cierra sesión
const App = () => {
  const { loading } = useLocale()
  const [showApp, setShowApp] = useState(false)

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShowApp(true), 50)
    }
  }, [loading])

  return (
    <div className="relative min-h-dvh">
      <div
        className={`fixed inset-0 z-50 w-full h-dvh flex items-center justify-center transition-opacity duration-500 ${
          showApp ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
        <Loading />
      </div>
      {!loading && (
        <SessionProvider>
          <div
            className={`transition-opacity duration-500 ${
              showApp ? "opacity-100" : "opacity-0"
            }`}>
            <div
              id="app"
              data-theme="mytheme"
              className="bg-base-300 min-h-dvh grid grid-rows-[auto_1fr_auto]">
              <Notifications />
              <Navbar />
              <Router />
              <Footer />
            </div>
          </div>
        </SessionProvider>
      )}
    </div>
  )
}
export default App
