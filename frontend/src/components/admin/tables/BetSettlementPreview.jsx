import React from "react"
import TruncateId from "@/components/admin/renderers/TruncateId"
import { useLocale } from "@/providers/LocaleProvider"
import { formatBetAmount } from "@/utils/betsUtils"

const BetSettlementPreview = ({ preview }) => {
  const { t } = useLocale()

  if (!preview) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 p-5 text-sm text-base-content/60">
        {t("adminPanel.bets.detail.noPreview")}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
            {t("adminPanel.bets.detail.winningOption")}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {preview.winningOption?.label || "--"}
          </p>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
            {t("adminPanel.bets.detail.totalWinningAmount")}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {formatBetAmount(preview.totalWinningAmount)}
          </p>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
            {t("adminPanel.bets.detail.totalProjectedPayout")}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {formatBetAmount(preview.totalProjectedPayout)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-200/40">
        <table className="table table-sm md:table-md">
          <thead className="bg-base-100">
            <tr>
              <th>{t("adminPanel.bets.detail.userId")}</th>
              <th>{t("adminPanel.bets.detail.poolAmount")}</th>
              <th>{t("adminPanel.bets.detail.payout")}</th>
            </tr>
          </thead>
          <tbody>
            {preview.winners?.length > 0 ? (
              preview.winners.map((winner) => (
                <tr
                  key={winner.user_id}
                  className="even:bg-base-200 odd:bg-neutral hover:bg-base-300 transition-colors">
                  <td>
                    <TruncateId id={winner.user_id} />
                  </td>
                  <td>{formatBetAmount(winner.amount)}</td>
                  <td>{formatBetAmount(winner.payout)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  {t("adminPanel.bets.detail.emptyWinners")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BetSettlementPreview
