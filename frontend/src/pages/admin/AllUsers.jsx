import React from "react"
import { useNavigate } from "react-router-dom"
import { useLocale } from "@/providers/LocaleProvider"
import Title from "@/components/layout/fonts/Title"
import GradientBg from "@/components/layout/GradientBg"
import Button from "@/components/buttons/Button"
import UserPlusSVG from "@/components/svg/users/UserPlusSVG"
import UsersTable from "@/components/admin/tables/UsersTable"
import LogsSVG from "@/components/svg/pictures/LogsSVG"
import GoBackBtn from "@/components/buttons/GoBackBtn"

const AllUsers = () => {
  const navigate = useNavigate()
  const { t } = useLocale()

  return (
    <GradientBg>
      <div className="flex flex-col gap-4">
        <Title>{t("adminPanel.users.title")}</Title>

        <div className="flex justify-between items-center w-full gap-3 flex-wrap">
          {/* Lado Izquierdo: Botón de volver solo */}
          <div>
            <GoBackBtn link={"/home"} />
          </div>

          {/* Lado Derecho: Acciones agrupadas */}
          <div className="flex gap-2">
            <Button
              svg={<LogsSVG />}
              variant="secondary"
              onClick={() => navigate("/admin/logs")}>
              {t("adminPanel.users.viewLogs")}
            </Button>

            <Button
              svg={<UserPlusSVG />}
              variant="success"
              onClick={() => navigate("/admin/users/create")}>
              {t("adminPanel.users.createNewUser")}
            </Button>
          </div>
        </div>

        <UsersTable />
      </div>
    </GradientBg>
  )
}

export default AllUsers
