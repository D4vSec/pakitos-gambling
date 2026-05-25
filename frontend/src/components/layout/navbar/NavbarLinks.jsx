import HomeSVG from "@/components/svg/pictures/HomeSVG"
import CardsSVG from "@/components/svg/pictures/CardsSVG"
import CoinsSVG from "@/components/svg/pictures/CoinsSVG"
import StarSVG from "@/components/svg/pictures/StarSVG"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"

const NavbarLinks = ({ className = "" }) => {
  const { t } = useLocale()
  const navigate = useNavigate()
  const links = [
    {
      key: "home",
      label: "navbar.home",
      Icon: HomeSVG,
      link: "/home",
    },
    {
      key: "allGames",
      label: "navbar.allGames",
      Icon: CardsSVG,
      link: "/home",
    },
    {
      key: "bets",
      label: "navbar.bets",
      Icon: CoinsSVG,
      link: "/bets",
    },
    {
      key: "favourites",
      label: "navbar.favourites",
      Icon: StarSVG,
      link: "/",
    },
  ]

  const isHorizontal = className.includes("menu-horizontal")

  return (
    <ul className={`menu ${className}`}>
      {links.map(({ key, Icon, label, link }) => (
        <li key={key}>
          <div className="flex items-center gap-1" onClick={() => navigate(link)}>
            <Icon />
            <a className={`${isHorizontal ? "hidden" : ""} lg:block`}>
              {t(label)}
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default NavbarLinks
