import React from "react"
import CherrySVG from "@/components/svg/CherrySVG"
import MenuSVG from "@/components/svg/MenuSVG"
import CloseSVG from "@/components/svg/CloseSVG"
import Button from "@/components/buttons/Button"
import NavbarLinks from "./NavbarLinks"
import NavbarBtns from "./NavbarBtns"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"
import LangDropdown from "./LangDropdown"

const Navbar = () => {
    const { t } = useLocale()
    const navigate = useNavigate()

    return (
        <div className="drawer sticky top-0 z-10 m">
            <input id="main-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <div className="navbar bg-base-100 shadow-sm flex justify-between items-center">
                    {/* IZQUIERDA */}
                    <div className="flex items-center gap-3">
                        <label htmlFor="main-drawer" className="btn btn-ghost btn-circle md:hidden">
                            <MenuSVG />
                        </label>

                        <div className="flex gap-2 items-center">
                            <div className="w-fit bg-primary rounded-xl p-2">
                                <CherrySVG />
                            </div>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="text-xl"
                                onClick={() => navigate("/")}
                            >
                                Pakito`s Gambling
                            </Button>
                        </div>
                    </div>

                    {/* CENTRO */}
                    <div className="hidden md:flex">
                        <NavbarLinks className="menu-horizontal" />
                    </div>

                    {/* DERECHA */}
                    <NavbarBtns className="hidden md:flex" />
                </div>
            </div>

            {/* SIDEBAR (mobile) */}
            <div className="drawer-side">
                <label
                    htmlFor="main-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>

                <div className="bg-base-200 min-h-full w-80 p-4 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-base-content">
                            {t("general.navbar.menu")}
                        </h2>

                        <label htmlFor="main-drawer" className="btn btn-ghost btn-circle">
                            <CloseSVG />
                        </label>
                    </div>

                    <div className="divider"></div>

                    {/* Menu principal */}
                    <NavbarLinks className="w-full" />

                    {/* Separador */}
                    <div className="divider"></div>

                    {/* Auth section mobile */}
                    <NavbarBtns vertical className="flex flex-col gap-3 w-full" />
                </div>
            </div>
        </div>
    )
}

export default Navbar
