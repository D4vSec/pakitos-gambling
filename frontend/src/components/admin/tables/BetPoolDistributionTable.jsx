import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { formatBetAmount, normalizeBetOdd } from "@/utils/betsUtils"

const BetPoolDistributionTable = ({ poolDistribution = [] }) => {
  const { t } = useLocale()

  return (
    <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-200/40">
      <table className="table table-sm md:table-md">
        <thead>
          <tr>
            <th>{t("adminPanel.bets.detail.option")}</th>
            <th>{t("adminPanel.bets.detail.poolAmount")}</th>
            <th>{t("adminPanel.bets.detail.odds")}</th>
          </tr>
        </thead>
        <tbody>
          {poolDistribution.length > 0 ? (
            poolDistribution.map((option) => (
              <tr key={option.id} className="text-sm md:text-md">
                <td>{option.label}</td>
                <td>{formatBetAmount(option.amount)}</td>
                <td>x{normalizeBetOdd(option.odd)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                {t("ui.tables.noData")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default BetPoolDistributionTable
