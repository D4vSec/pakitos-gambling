import React from "react"
import AdminPageHeader from "@/components/admin/components/AdminPageHeader"
import UsersTable from "@/components/admin/tables/UsersTable"
import NavigationBtn from "@/components/buttons/NavigationBtn"
import { IconUserPlus } from "@tabler/icons-react"
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
            svg={<IconUserPlus />}
            className="w-full sm:w-fit"
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
