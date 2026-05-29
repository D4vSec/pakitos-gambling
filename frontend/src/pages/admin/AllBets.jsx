import React from "react"
import AdminPageHeader from "@/components/admin/components/AdminPageHeader"
import BetsTable from "@/components/admin/tables/BetsTable"
import NavigationBtn from "@/components/buttons/NavigationBtn"
import { IconCoins } from "@tabler/icons-react"
import { useLocale } from "@/providers/LocaleProvider"

const AllBets = () => {
  const { t } = useLocale()

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader
        title={t("adminPanel.bets.title")}
        backLink="/home"
        actions={
          <NavigationBtn
            type="button"
            svg={<IconCoins />}
            variant="success"
            to="/admin/bets/create">
            {t("adminPanel.bets.createNewBet")}
          </NavigationBtn>
        }
      />

      <BetsTable />
    </div>
  )
}

export default AllBets
