import React from "react"
import CherrySVG from "../svg/CherrySVG"
import MenuSVG from "../svg/MenuSVG"
import CardsSVG from "../svg/CardsSVG"
import HomeSVG from "../svg/HomeSVG"
import StarSVG from "../svg/StarSVG"
import CloseSVG from "../svg/CloseSVG"
import UserSVG from "../svg/UserSVG"
import { useLocale } from "../../providers/LocaleProvider"

const Navbar = () => {
    const { t } = useLocale()

    return (
        <div className="drawer">
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
                            <a className="btn btn-ghost text-xl">Pakito`s Gambling</a>
                        </div>
                    </div>

                    {/* CENTRO */}
                    <div className="hidden md:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li>
                                <div className="flex items-center gap-1">
                                    <HomeSVG />
                                    <a className="hidden lg:block">{t("general.navbar.home")}</a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-1">
                                    <CardsSVG />
                                    <a className="hidden lg:block">
                                        {t("general.navbar.allGames")}
                                    </a>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-1">
                                    <StarSVG />
                                    <a className="hidden lg:block">
                                        {t("general.navbar.favourites")}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* DERECHA */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex gap-2 items-center">
                            <a className="btn btn-secondary">{t("general.navbar.register")}</a>
                            <a className="btn btn-primary">{t("general.navbar.login")}</a>
                        </div>

                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex gap-2 items-center btn rounded-selector"
                            >
                                <UserSVG />
                                <p>{t("general.navbar.userPill.guest")}</p>
                            </div>

                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow"
                            >
                                <li>
                                    <a>{t("general.navbar.userPill.settings")}</a>
                                </li>
                                <li>
                                    <a>{t("general.navbar.userPill.coupon")}</a>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <a className="text-error">
                                        {t("general.navbar.userPill.logout")}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
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
                    <ul className="menu p-0 w-full">
                        <li>
                            <div className="flex items-center">
                                <HomeSVG />
                                <a>{t("general.navbar.home")}</a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <CardsSVG />
                                <a>{t("general.navbar.allGames")}</a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <StarSVG />
                                <a>{t("general.navbar.favourites")}</a>
                            </div>
                        </li>
                    </ul>

                    {/* Separador */}
                    <div className="divider"></div>

                    {/* Auth section mobile */}
                    <div className="flex flex-col gap-3">
                        {/* Botones Register / Login */}
                        <a className="btn btn-secondary w-full">{t("general.navbar.register")}</a>
                        <a className="btn btn-primary w-full">{t("general.navbar.login")}</a>

                        {/* Dropdown usuario */}
                        <div className="dropdown-open w-full">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex gap-2 justify-center items-center btn rounded-selector w-full"
                            >
                                <UserSVG />
                                <p>{t("general.navbar.userPill.guest")}</p>
                            </div>

                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-1 mt-2 w-full p-2 shadow"
                            >
                                <li>
                                    <a>{t("general.navbar.userPill.settings")}</a>
                                </li>
                                <li>
                                    <a>{t("general.navbar.userPill.coupon")}</a>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <a className="text-error">
                                        {t("general.navbar.userPill.logout")}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
