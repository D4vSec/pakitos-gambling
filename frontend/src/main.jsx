import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import LocaleProvider from "./providers/LocaleProvider"
import NotificationProvider from "./providers/NotificationProvider"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <NotificationProvider>
                <LocaleProvider>
                    <App />
                </LocaleProvider>
            </NotificationProvider>
        </BrowserRouter>
    </StrictMode>,
)
