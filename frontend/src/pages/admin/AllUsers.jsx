import React from "react"
import { useNavigate } from "react-router-dom"
import AdminPageHeader from "@/components/admin/components/AdminPageHeader"
import UsersTable from "@/components/admin/tables/UsersTable"
import Button from "@/components/buttons/Button"
import UserPlusSVG from "@/components/svg/users/UserPlusSVG"
import { useLocale } from "@/providers/LocaleProvider"

const AllUsers = () => {
  const navigate = useNavigate()
  const { t } = useLocale()

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader
        title={t("adminPanel.users.title")}
        backLink="/home"
        actions={
          <Button
            type="button"
            svg={<UserPlusSVG />}
            variant="success"
            onClick={() => navigate("/admin/users/create")}>
            {t("adminPanel.users.createNewUser")}
          </Button>
        }
      />
      <UsersTable />
    </div>
  )
}

export default AllUsers
