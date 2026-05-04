import React from "react"
import { useNavigate } from "react-router-dom"
import { useLocale } from "@/providers/LocaleProvider"
import Title from "@/components/Title"
import GradientBg from "@/components/layout/GradientBg"
import Button from "@/components/buttons/Button"
import UserPlusSVG from "@/components/svg/UserPlusSVG"
import UsersTable from "@/components/admin/tables/UsersTable"
import LogsSVG from "@/components/svg/LogsSVG"

const AllUsers = () => {
  const navigate = useNavigate()
  const { t } = useLocale()

  return (
    <GradientBg>
      <Title>{t("adminPanel.allUsers.title")}</Title>
      <UsersTable />
      <div className="flex gap-4">
        <Button
          svg={<UserPlusSVG />}
          variant="success"
          onClick={() => navigate("/admin/users/create")}>
          {t("adminPanel.allUsers.createNewUser")}
        </Button>
        <Button
          svg={<LogsSVG />}
          variant="secondary"
          onClick={() => navigate("/admin/logs")}>
          {t("adminPanel.allUsers.viewLogs")}
        </Button>
      </div>
    </GradientBg>
  )
}

export default AllUsers
