import React, { useEffect } from "react"
import Title from "./Title"
import GradientBg from "./layout/GradientBg"
import Button from "./buttons/Button"
import { useLocale } from "../providers/LocaleProvider"
import { useSession } from "../providers/SessionProvider"
import { useNavigate } from "react-router-dom"
import Loading from "./Loading"

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { t } = useLocale()
    const { isLogged, loading, user } = useSession()
    const navigate = useNavigate()
    const requireLogged = true
    
    return loading ? (
        <Loading />
    ) : requireLogged && !isLogged ? (
        <GradientBg>
            <Title>{t("message.error.noLogin")}</Title>
            <Button size="lg">Return home</Button>
        </GradientBg>
    ) : requireAdmin && user.role !== "admin" ? (
        <GradientBg>
            <Title>{t("message.error.noAdmin")}</Title>
            <Button variant="primary" size="lg" onClick={() => navigate("/")}>
                Return home
            </Button>
        </GradientBg>
    ) : (
        children
    )
}

export default ProtectedRoute
