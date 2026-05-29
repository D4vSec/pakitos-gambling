import {
  IconCards,
  IconCoins,
  IconHome,
  IconStar,
} from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"
import { useNavigate } from "react-router-dom"

const NavbarLinks = ({ className = "" }) => {
  const { t } = useLocale()
  const navigate = useNavigate()
  const links = [
    {
      key: "home",
      label: "navbar.home",
      Icon: IconHome,
      link: "/",
    },
    {
      key: "allGames",
      label: "navbar.allGames",
      Icon: IconCards,
      link: "/home",
    },
    {
      key: "bets",
      label: "navbar.bets",
      Icon: IconCoins,
      link: "/bets",
    },
  ]

  const isHorizontal = className.includes("menu-horizontal")

  return (
    <ul className={`menu ${className}`}>
      {links.map(({ key, Icon, label, link }) => (
        <li key={key}>
          <div
            className="flex items-center gap-1"
            onClick={() => navigate(link)}>
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
