import React, { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BetStatusBadge from "@/components/badges/BetStatusBadge"
import Button from "@/components/buttons/Button"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import Loading from "@/components/Loading"
import AdminSectionNav from "@/components/admin/components/AdminSectionNav"
import BetPoolDistributionTable from "@/components/admin/tables/BetPoolDistributionTable"
import BetSettlementPreview from "@/components/admin/tables/BetSettlementPreview"
import GradientBg from "@/components/layout/GradientBg"
import Title from "@/components/layout/fonts/Title"
import CloseSVG from "@/components/svg/actions/CloseSVG"
import EditSVG from "@/components/svg/actions/EditSVG"
import TrashXSVG from "@/components/svg/actions/TrashXSVG"
import ReloadSVG from "@/components/svg/pictures/ReloadSVG"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import { formatBetAmount, formatBetDate } from "@/utils/betsUtils"

const BetDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLocale()
  const {
    closeBetModal,
    deleteBetModal,
    getAdminBet,
    getBetSettlementPreview,
    settleBetModal,
  } = useAdmin()
  const [betData, setBetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [selectedWinningOptionId, setSelectedWinningOptionId] = useState("")

  const loadBet = useCallback(async () => {
    setLoading(true)
    const response = await getAdminBet(id)

    if (response) {
      setBetData(response)
      setSelectedWinningOptionId((currentOptionId) => {
        if (
          currentOptionId &&
          response.options?.some((option) => option.id === currentOptionId)
        ) {
          return currentOptionId
        }

        return response.options?.[0]?.id || ""
      })
    } else {
      setBetData(null)
    }

    setPreview(null)
    setLoading(false)
  }, [getAdminBet, id])

  useEffect(() => {
    loadBet()
  }, [loadBet])

  if (loading) {
    return <Loading />
  }

  if (!betData) {
    return (
      <GradientBg>
        <div className="flex w-full max-w-6xl flex-col gap-4">
          <GoBackBtn link="/admin/bets" />
          <AdminSectionNav />

          <section className="rounded-[2rem] border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-xl">
            <Title className="m-0 text-4xl">
              {t("adminPanel.bets.detail.noBet")}
            </Title>
          </section>
        </div>
      </GradientBg>
    )
  }

  const { bet, options, poolDistribution, totalPool } = betData
  const settlement = betData.settlement
  const selectedWinningOption =
    options?.find((option) => option.id === selectedWinningOptionId) || null
  const isSettled = Boolean(settlement)

  return (
    <GradientBg>
      <div className="flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GoBackBtn link="/admin/bets" />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              svg={<ReloadSVG />}
              onClick={() => loadBet()}>
              {t("adminPanel.bets.detail.refresh")}
            </Button>
            <Button
              type="button"
              variant="warning"
              svg={<EditSVG />}
              onClick={() => navigate(`/admin/bets/edit/${id}`)}>
              {t("adminPanel.bets.detail.editBet")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              svg={<CloseSVG />}
              disabled={bet.status === "closed" || isSettled}
              onClick={() => closeBetModal(id, bet.label, loadBet)}>
              {t("adminPanel.bets.detail.closeBet")}
            </Button>
            <Button
              type="button"
              variant="error"
              svg={<TrashXSVG />}
              onClick={() =>
                deleteBetModal(id, bet.label, () => {
                  navigate("/admin/bets")
                })
              }>
              {t("adminPanel.bets.detail.deleteBet")}
            </Button>
          </div>
        </div>

        <AdminSectionNav />

        <section className="overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-2xl shadow-primary/5 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <Title className="m-0 text-left text-4xl md:text-5xl">
                {bet.label}
              </Title>
              <p className="mt-3 max-w-3xl text-sm text-base-content/70 md:text-base">
                {t("adminPanel.bets.detail.summary")}
              </p>
            </div>

            <BetStatusBadge status={bet.status} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                {t("adminPanel.bets.table.status")}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {t(`pages.bets.status.${bet.status}`)}
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                {t("adminPanel.bets.table.ends_at")}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatBetDate(bet.ends_at)}
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                {t("adminPanel.bets.detail.totalPool")}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatBetAmount(totalPool)}
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                {t("adminPanel.bets.table.options")}
              </p>
              <p className="mt-2 text-lg font-semibold">
                {options?.length || 0}
              </p>
            </div>
          </div>

          {isSettled ? (
            <div className="mt-6 rounded-[1.75rem] border border-success/20 bg-success/10 p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                    {t("adminPanel.bets.detail.settledResult")}
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {settlement.winningOption?.label || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                    {t("adminPanel.bets.detail.settledAt")}
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {settlement.settledAt
                      ? formatBetDate(settlement.settledAt)
                      : "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                    {t("adminPanel.bets.detail.totalProjectedPayout")}
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {formatBetAmount(settlement.totalProjectedPayout)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
          <section className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-xl">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {t("adminPanel.bets.detail.poolDistribution")}
              </h2>
              <p className="mt-2 text-sm text-base-content/70">
                {t("adminPanel.bets.detail.poolHint")}
              </p>
            </div>

            <BetPoolDistributionTable poolDistribution={poolDistribution} />
          </section>

          <aside className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">
              {isSettled
                ? t("adminPanel.bets.detail.settledResult")
                : t("adminPanel.bets.detail.settlementPreview")}
            </h2>
            <p className="mt-2 text-sm text-base-content/70">
              {isSettled
                ? t("adminPanel.bets.detail.settledHint")
                : t("adminPanel.bets.detail.previewHint")}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="floating-label w-full">
                <span>{t("adminPanel.bets.detail.selectWinningOption")}</span>
                <select
                  className="select select-lg w-full"
                  value={selectedWinningOptionId}
                  disabled={isSettled}
                  onChange={(event) =>
                    setSelectedWinningOptionId(event.target.value)
                  }>
                  {options?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <Button
                type="button"
                className="w-full"
                disabled={
                  !selectedWinningOptionId || previewLoading || isSettled
                }
                onClick={async () => {
                  setPreviewLoading(true)
                  const response = await getBetSettlementPreview(
                    id,
                    selectedWinningOptionId,
                  )
                  if (response) {
                    setPreview(response)
                  }
                  setPreviewLoading(false)
                }}>
                {t("adminPanel.bets.detail.generatePreview")}
              </Button>

              {!isSettled ? (
                <Button
                  type="button"
                  variant="success"
                  className="w-full"
                  disabled={!selectedWinningOption}
                  onClick={() =>
                    settleBetModal(
                      id,
                      bet.label,
                      selectedWinningOption.label,
                      selectedWinningOption.id,
                      loadBet,
                    )
                  }>
                  {t("adminPanel.bets.detail.settleBet")}
                </Button>
              ) : null}

              <BetSettlementPreview
                preview={isSettled ? settlement : preview}
              />
            </div>
          </aside>
        </div>
      </div>
    </GradientBg>
  )
}

export default BetDetails
