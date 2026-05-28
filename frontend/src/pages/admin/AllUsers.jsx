import React from "react"
import AdminPageHeader from "@/components/admin/components/AdminPageHeader"
import UsersTable from "@/components/admin/tables/UsersTable"
import NavigationBtn from "@/components/buttons/NavigationBtn"
import UserPlusSVG from "@/components/svg/users/UserPlusSVG"
import { useLocale } from "@/providers/LocaleProvider"

const AllUsers = () => {
  const { t } = useLocale()

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader
        title={t("adminPanel.users.title")}
        backLink="/home"
        actions={
          <NavigationBtn
            type="button"
            svg={<UserPlusSVG />}
            variant="success"
            to="/admin/users/create">
            {t("adminPanel.users.createNewUser")}
          </NavigationBtn>
        }
      />
      <UsersTable />
    </div>
  )
}

export default AllUsers
