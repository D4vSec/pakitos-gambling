import React, { useEffect, useRef } from "react"
import CherrySVG from "@/components/svg/pictures/CherrySVG"
import MenuSVG from "@/components/svg/pictures/MenuSVG"
import CloseSVG from "@/components/svg/actions/CloseSVG"
import NavigationBtn from "@/components/buttons/NavigationBtn"
import NavbarLinks from "./NavbarLinks"
import NavbarBtns from "./NavbarBtns"
import { useLocale } from "@/providers/LocaleProvider"
import { useLocation } from "react-router-dom"

const Navbar = () => {
  const { t } = useLocale()
  const location = useLocation()
  const drawerRef = useRef(null)

  useEffect(() => {
    if (drawerRef.current) {
      drawerRef.current.checked = false
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [location.key])

  return (
    <div className="drawer drawer-end sticky top-0 z-999">
      <input
        id="main-drawer"
        ref={drawerRef}
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 shadow-sm flex justify-between items-center">
          {/* Left */}
          <div className="flex items-center justify-between w-full md:w-fit gap-3">
            <div className="flex gap-2 items-center">
              <div className="w-fit bg-primary rounded-xl p-2">
                <CherrySVG />
              </div>
              <NavigationBtn
                variant="ghost"
                size="lg"
                className="text-xl"
                to="/">
                Pakito`s Gambling
              </NavigationBtn>
            </div>

            <label
              htmlFor="main-drawer"
              className="btn btn-ghost btn-circle md:hidden">
              <MenuSVG />
            </label>
          </div>

          {/* Center */}
          <div className="hidden md:flex">
            <NavbarLinks className="menu-horizontal" />
          </div>

          {/* Right */}
          <NavbarBtns className="hidden md:flex" />
        </div>
      </div>

      {/* SIDEBAR (mobile) */}
      <div className="drawer-side">
        <label
          htmlFor="main-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"></label>

        <div className="bg-base-200 h-full w-65 p-4 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-base-content">
              {t("navbar.menu")}
            </h2>
            <label htmlFor="main-drawer" className="btn btn-ghost btn-circle">
              <CloseSVG />
            </label>
          </div>

          <div className="divider m-1"></div>

          {/* Main Links */}
          <NavbarLinks className="w-full" />

          <div className="divider m-1"></div>

          {/* Auth section mobile */}
          <NavbarBtns vertical className="flex flex-col gap-3 w-full" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
