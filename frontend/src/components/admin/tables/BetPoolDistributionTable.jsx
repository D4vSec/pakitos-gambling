import React from "react"
import { useLocale } from "@/providers/LocaleProvider"
import { formatBetAmount, normalizeBetOdd } from "@/utils/betsUtils"

const BetPoolDistributionTable = ({ poolDistribution = [] }) => {
  const { t } = useLocale()
  const hasData = poolDistribution.length > 0

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-auto">
      <table className="table table-sm sm:table-md rounded-lg">
        <thead>
          <tr className="bg-base-100">
            <th>{t("adminPanel.bets.detail.option")}</th>
            <th>{t("adminPanel.bets.detail.poolAmount")}</th>
            <th>{t("adminPanel.bets.detail.odds")}</th>
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            poolDistribution.map((option) => (
              <tr
                key={option.id}
                className="even:bg-base-200 odd:bg-neutral hover:bg-base-300 transition-colors">
                <td className="whitespace-nowrap">{option.label}</td>
                <td className="whitespace-nowrap">
                  {formatBetAmount(option.amount)}
                </td>
                <td className="whitespace-nowrap">
                  x{normalizeBetOdd(option.odd)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-6 text-center">
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
