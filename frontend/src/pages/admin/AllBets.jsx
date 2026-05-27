import React from "react"
import { useNavigate } from "react-router-dom"
import AdminPageHeader from "@/components/admin/components/AdminPageHeader"
import BetsTable from "@/components/admin/tables/BetsTable"
import Button from "@/components/buttons/Button"
import CoinsSVG from "@/components/svg/pictures/CoinsSVG"
import { useLocale } from "@/providers/LocaleProvider"

const AllBets = () => {
  const navigate = useNavigate()
  const { t } = useLocale()

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader
        title={t("adminPanel.bets.title")}
        backLink="/home"
        actions={
          <Button
            type="button"
            svg={<CoinsSVG />}
            variant="success"
            onClick={() => navigate("/admin/bets/create")}>
            {t("adminPanel.bets.createNewBet")}
          </Button>
        }
      />

      <BetsTable />
    </div>
  )
}

export default AllBets
