import React, { useCallback, useEffect, useState } from "react"
import BetOptionPill from "@/components/bets/BetOptionPill"
import BetStatusBadge from "@/components/bets/BetStatusBadge"
import Button from "@/components/buttons/Button"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import Loading from "@/components/Loading"
import GradientBg from "@/components/layout/GradientBg"
import Title from "@/components/layout/fonts/Title"
import useBets from "@/hooks/useBets"
import { useLocale } from "@/providers/LocaleProvider"
import { formatBetDate, normalizeBetOdd, sortBetOptions } from "@/utils/betsUtils"
import { useLocation, useParams } from "react-router-dom"

const BetDetailsPage = () => {
  const { betId } = useParams()
  const location = useLocation()
  const { t } = useLocale()
  const { getBets, getBetOptions, placeBet } = useBets()
  const [bet, setBet] = useState(location.state?.bet || null)
  const [options, setOptions] = useState(sortBetOptions(location.state?.bet?.options || []))
  const [selectedOptionId, setSelectedOptionId] = useState(location.state?.bet?.options?.[0]?.id || "")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadBet = useCallback(async () => {
    setLoading(true)

    const [markets, marketOptions] = await Promise.all([getBets(), getBetOptions(betId)])
    const currentBet = markets.find((market) => market.id === betId) || location.state?.bet || null
    const nextOptions = sortBetOptions(
      marketOptions.length > 0 ? marketOptions : currentBet?.options || [],
    )

    setBet(currentBet)
    setOptions(nextOptions)
    setSelectedOptionId((currentOptionId) => {
      if (currentOptionId && nextOptions.some((option) => option.id === currentOptionId)) {
        return currentOptionId
      }

      return nextOptions[0]?.id || ""
    })

    setLoading(false)
  }, [betId, getBets, getBetOptions, location.state?.bet])

  useEffect(() => {
    loadBet()
  }, [loadBet])

  if (loading) {
    return <Loading />
  }

  if (!bet) {
    return (
      <GradientBg>
        <div className="flex w-full max-w-5xl flex-col gap-6">
          <GoBackBtn link="/bets" />

          <section className="rounded-[2rem] border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-xl">
            <Title className="m-0 text-4xl">{t("pages.bets.detail.noMarket")}</Title>
          </section>
        </div>
      </GradientBg>
    )
  }

  const isClosed = bet.status === "closed"
  const selectedOption = options.find((option) => option.id === selectedOptionId) || null
  const numericAmount = Number(amount)
  const isSubmitDisabled =
    isClosed || submitting || !selectedOptionId || !Number.isFinite(numericAmount) || numericAmount <= 0

  return (
    <GradientBg>
      <div className="flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GoBackBtn link="/bets" />

          <Button variant="secondary" onClick={() => loadBet()}>
            {t("pages.bets.detail.refresh")}
          </Button>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-2xl shadow-primary/5 md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Title className="m-0 text-left text-4xl md:text-5xl">{bet.label}</Title>
              <p className="mt-3 max-w-3xl text-sm text-base-content/70 md:text-base">
                {t("pages.bets.detail.hint")}
              </p>
            </div>

            <BetStatusBadge status={bet.status} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                {t("pages.bets.card.endsAt")}
              </p>
              <p className="mt-2 text-lg font-semibold">{formatBetDate(bet.ends_at)}</p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                {t("pages.bets.detail.options")}
              </p>
              <p className="mt-2 text-lg font-semibold">{options.length}</p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                {t("pages.bets.detail.selectedOption")}
              </p>
              <p className="mt-2 truncate text-lg font-semibold">
                {selectedOption ? selectedOption.label : t("pages.bets.detail.pickOption")}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <section className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-xl">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{t("pages.bets.detail.options")}</h2>
              <p className="mt-2 text-sm text-base-content/70">{t("pages.bets.detail.pickOption")}</p>
            </div>

            {options.length > 0 ? (
              <div className="grid gap-3">
                {options.map((option) => (
                  <BetOptionPill
                    key={option.id}
                    label={option.label}
                    odd={option.odd}
                    selected={selectedOptionId === option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    disabled={isClosed}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-5 text-sm text-base-content/60">
                {t("pages.bets.detail.noOptions")}
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">{t("pages.bets.detail.placeBet")}</h2>
            <p className="mt-2 text-sm text-base-content/70">{t("pages.bets.detail.selection")}</p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                  {t("pages.bets.detail.selectedOption")}
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {selectedOption ? selectedOption.label : t("pages.bets.detail.pickOption")}
                </p>
                {selectedOption && (
                  <p className="mt-2 text-sm text-primary">
                    {t("pages.bets.detail.odds")}: x{normalizeBetOdd(selectedOption.odd)}
                  </p>
                )}
              </div>

              <label className="floating-label w-full">
                <span>{t("pages.bets.detail.amountLabel")}</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="input input-lg w-full"
                  value={amount}
                  placeholder={t("pages.bets.detail.amountPlaceholder")}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </label>

              {isClosed && (
                <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                  {t("pages.bets.detail.closedMessage")}
                </div>
              )}

              <Button
                variant={isClosed ? "secondary" : "primary"}
                className="w-full"
                disabled={isSubmitDisabled}
                onClick={async () => {
                  setSubmitting(true)

                  const response = await placeBet(betId, {
                    betOptionId: selectedOptionId,
                    amount: numericAmount,
                  })

                  if (response) {
                    setAmount("")
                    await loadBet()
                  }

                  setSubmitting(false)
                }}>
                {t("pages.bets.detail.placeBet")}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </GradientBg>
  )
}

export default BetDetailsPage
