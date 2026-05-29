import React, { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BetStatusBadge from "@/components/badges/BetStatusBadge"
import Button from "@/components/buttons/Button"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import Loading from "@/components/Loading"
import BetPoolDistributionTable from "@/components/admin/tables/BetPoolDistributionTable"
import BetSettlementPreview from "@/components/admin/tables/BetSettlementPreview"
import Title from "@/components/layout/fonts/Title"
import CloseSVG from "@/components/svg/actions/CloseSVG"
import EditSVG from "@/components/svg/actions/EditSVG"
import TrashXSVG from "@/components/svg/actions/TrashXSVG"
import ReloadSVG from "@/components/svg/pictures/ReloadSVG"
import { useAdmin } from "@/providers/AdminProvider"
import { useLocale } from "@/providers/LocaleProvider"
import { formatBetAmount, formatBetDate } from "@/utils/betsUtils"
import Subtitle from "@/components/layout/fonts/Subtitle"

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
  const getAdminBetRef = useRef(getAdminBet)

  useEffect(() => {
    getAdminBetRef.current = getAdminBet
  }, [getAdminBet])

  const loadBet = useCallback(async () => {
    setLoading(true)
    const response = await getAdminBetRef.current(id)

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
  }, [id])

  useEffect(() => {
    loadBet()
  }, [id, loadBet])

  const { bet, options, poolDistribution, totalPool } = betData ?? {}
  const settlement = betData?.settlement
  const selectedWinningOption =
    options?.find((option) => option.id === selectedWinningOptionId) || null
  const isSettled = Boolean(settlement)
  const infoCards = [
    {
      label: t("adminPanel.bets.table.status"),
      value: t(`pages.bets.status.${bet?.status}`),
    },
    {
      label: t("adminPanel.bets.table.ends_at"),
      value: formatBetDate(bet?.ends_at),
    },
    {
      label: t("adminPanel.bets.detail.totalPool"),
      value: formatBetAmount(totalPool),
    },
    {
      label: t("adminPanel.bets.table.options"),
      value: options?.length || 0,
    },
  ]

  return loading ? (
    <Loading />
  ) : !bet ? (
    <div className="flex w-full max-w-6xl flex-col gap-6">
      <GoBackBtn link="/admin/bets" />
      <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-xl">
        <Title className="m-0 text-3xl sm:text-4xl">
          {t("adminPanel.bets.detail.noBet")}
        </Title>
      </section>
    </div>
  ) : (
    <div className="flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <GoBackBtn link="/admin/bets" />
        <div className="w-full md:w-auto grid gap-2 grid-cols-2 md:grid-cols-4">
          <Button
            type="button"
            variant="secondary"
            svg={<ReloadSVG />}
            className="flex-1"
            onClick={() => loadBet()}>
            {t("adminPanel.bets.detail.refresh")}
          </Button>
          <Button
            type="button"
            variant="warning"
            svg={<EditSVG />}
            className="flex-1"
            onClick={() => navigate(`/admin/bets/edit/${id}`)}>
            {t("adminPanel.bets.detail.editBet")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            svg={<CloseSVG />}
            className="flex-2"
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

      <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl shadow-primary/5 md:p-8">
        <div className="flex flex-col gap-2 md:gap-3">
          <div className="flex flex-col gap-4 md:gap-5">
            <BetStatusBadge status={bet.status} />
            <Subtitle className="m-0 text-left text-4xl md:text-5xl">
              {bet.label}
            </Subtitle>
          </div>
          <p className="max-w-3xl text-sm text-base-content/70 md:text-base">
            {t("adminPanel.bets.detail.summary")}
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-4">
          {infoCards.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-base-300 bg-base-300/70 p-3 md:p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/75">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {isSettled ? (
          <div className="mt-6 rounded-2xl border border-success/20 bg-success/10 p-5">
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
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

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <section className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl">
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

        <aside className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-xl">
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
              disabled={!selectedWinningOptionId || previewLoading || isSettled}
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
            <BetSettlementPreview preview={isSettled ? settlement : preview} />
          </div>
        </aside>
      </div>
    </div>
  )
}

export default BetDetails
