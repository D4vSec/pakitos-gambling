import React, { useCallback, useEffect, useRef, useState } from "react"
import BetOptionPill from "@/components/bets/BetOptionPill"
import BetStatusBadge from "@/components/badges/BetStatusBadge"
import Button from "@/components/buttons/Button"
import GoBackBtn from "@/components/buttons/GoBackBtn"
import Loading from "@/components/Loading"
import GradientBg from "@/components/layout/GradientBg"
import useBets from "@/hooks/useBets"
import { useLocale } from "@/providers/LocaleProvider"
import {
  formatBetAmount,
  formatBetDate,
  normalizeBetOdd,
} from "@/utils/betsUtils"
import { useLocation, useParams } from "react-router-dom"
import Subtitle from "@/components/layout/fonts/Subtitle"
import { useNotification } from "@/providers/NotificationProvider"
import BitcoinSVG from "@/components/svg/pictures/BitcoinSVG"

const sortOptionsForDetails = (options = []) =>
  [...options].sort((firstOption, secondOption) => {
    const labelCompare = String(firstOption?.label || "").localeCompare(
      String(secondOption?.label || ""),
    )

    if (labelCompare !== 0) return labelCompare

    return String(firstOption?.id || "").localeCompare(
      String(secondOption?.id || ""),
    )
  })

const BetDetailsPage = () => {
  const { betId } = useParams()
  const location = useLocation()
  const { t } = useLocale()
  const { addNotification } = useNotification()
  const { getBets, getBetOptions, placeBet } = useBets()
  const initialBetRef = useRef(location.state?.bet || null)
  const [bet, setBet] = useState(location.state?.bet || null)
  const [options, setOptions] = useState(
    sortOptionsForDetails(location.state?.bet?.options || []),
  )
  const [selectedOptionId, setSelectedOptionId] = useState(
    location.state?.bet?.options?.[0]?.id || "",
  )
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadBet = useCallback(
    async ({ showLoading = true } = {}) => {
      if (showLoading) setLoading(true)

      try {
        const [markets, marketOptions] = await Promise.all([
          getBets(),
          getBetOptions(betId),
        ])
        const currentBet =
          markets.find((market) => market.id === betId) ||
          initialBetRef.current ||
          null
        const nextOptions = sortOptionsForDetails(
          marketOptions.length > 0 ? marketOptions : currentBet?.options || [],
        )

        setBet(currentBet)
        setOptions(nextOptions)
        setSelectedOptionId((currentOptionId) => {
          if (
            currentBet?.hasUserBet &&
            currentBet?.userBet?.betOptionId &&
            nextOptions.some(
              (option) => option.id === currentBet.userBet.betOptionId,
            )
          ) {
            return currentBet.userBet.betOptionId
          }

          if (
            currentOptionId &&
            nextOptions.some((option) => option.id === currentOptionId)
          ) {
            return currentOptionId
          }

          return nextOptions[0]?.id || ""
        })
      } finally {
        if (showLoading) setLoading(false)
      }
    },
    [betId, getBets, getBetOptions],
  )

  useEffect(() => {
    let isActive = true

    const initLoad = async () => {
      if (!isActive) return
      await loadBet({ showLoading: true })
    }

    void initLoad()

    return () => {
      isActive = false
    }
  }, [loadBet])

  const isClosed = bet?.status === "closed"
  const hasUserBet = Boolean(bet?.hasUserBet)
  const userBet = bet?.userBet || null
  const selectedOption =
    options.find((option) => option.id === selectedOptionId) || null
  const displayedOptions = options.map((option) => ({
    ...option,
    odd:
      hasUserBet && option.id === userBet?.betOptionId
        ? userBet.odd
        : option.odd,
  }))
  const activeOptionLabel = hasUserBet
    ? userBet?.optionLabel || selectedOption?.label
    : selectedOption?.label
  const activeOdd = hasUserBet
    ? Number(userBet?.odd)
    : Number(selectedOption?.odd)
  const numericAmount = Number(amount)
  const summaryAmount = hasUserBet
    ? Number(userBet?.amount)
    : Number.isFinite(numericAmount) && numericAmount > 0
      ? numericAmount
      : 0
  const possibleOutcome =
    Number.isFinite(summaryAmount) && Number.isFinite(activeOdd)
      ? summaryAmount * activeOdd
      : 0
  const isSubmitDisabled =
    isClosed ||
    hasUserBet ||
    submitting ||
    !selectedOptionId ||
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0

  const infoCards = [
    {
      label: t("pages.bets.card.endsAt"),
      value: formatBetDate(bet?.ends_at),
    },
    {
      label: t("pages.bets.detail.options"),
      value: options.length,
    },
    {
      label: t("pages.bets.detail.selectedOption"),
      value: activeOptionLabel || t("pages.bets.detail.pickOption"),
      className: "truncate",
    },
  ]

  const onBet = async () => {
    if (hasUserBet) {
      addNotification(t("pages.bets.detail.alreadyPlacedBlock"), "warning")
      return
    }

    setSubmitting(true)

    const result = await placeBet(betId, {
      betOptionId: selectedOptionId,
      amount: numericAmount,
    })

    if (
      !result.success &&
      result.error?.message === "BET_ALREADY_PLACED_ON_MARKET"
    ) {
      const existingOptionLabel = result.error?.details?.existingOptionLabel

      if (existingOptionLabel) {
        addNotification(
          t("pages.bets.detail.alreadyPlacedWithOption", {
            option: existingOptionLabel,
          }),
          "warning",
        )
      }
    }

    if (result.success) {
      setAmount("")
      await loadBet({ showLoading: false })
    }

    setSubmitting(false)
  }

  return loading ? (
    <Loading />
  ) : !bet ? (
    <GradientBg>
      <div className="flex w-full max-w-5xl min-w-0 flex-col gap-6 overflow-x-hidden">
        <GoBackBtn link="/bets" />
        <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center shadow-xl">
          <Subtitle>{t("pages.bets.detail.noMarket")}</Subtitle>
        </section>
      </div>
    </GradientBg>
  ) : (
    <GradientBg>
      <div className="flex w-full max-w-7xl min-w-0 flex-col gap-6 overflow-x-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GoBackBtn link="/bets" />
          <Button
            variant="secondary"
            onClick={() => loadBet({ showLoading: true })}>
            {t("pages.bets.detail.refresh")}
          </Button>
        </div>

        {/* BET INFO */}
        <section className="order overflow-hidden rounded-2xl border-base-300 bg-base-100 p-5 shadow-2xl shadow-primary/5 md:p-8">
          <div className="flex min-w-0 flex-col gap-2 md:gap-3">
            <div className="flex min-w-0 flex-col gap-4 md:gap-5">
              <BetStatusBadge status={bet.status} />
              <Subtitle className="min-w-0 wrap-wrap-break-word text-left text-3xl md:text-5xl">
                {bet.label}
              </Subtitle>
            </div>
            <p className="max-w-3xl text-sm text-base-content/70 md:text-base">
              {t("pages.bets.detail.hint")}
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {infoCards.map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-2xl border border-base-300 bg-base-300/70 p-3 md:p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/75">
                  {item.label}
                </p>

                <p
                  className={`mt-2 wrap-wrap-break-word text-lg font-semibold ${item.className || ""}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* POSSIBLE BETS*/}
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
          <section className="min-w-0 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-xl md:p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {t("pages.bets.detail.options")}
              </h2>
              <p className="mt-2 text-sm text-base-content/70">
                {hasUserBet
                  ? t("pages.bets.detail.alreadyPlacedMessage")
                  : t("pages.bets.detail.pickOption")}
              </p>
            </div>

            {options.length > 0 ? (
              <div className="grid gap-3">
                {displayedOptions.map((option) => (
                  <BetOptionPill
                    key={option.id}
                    label={option.label}
                    odd={option.odd}
                    selected={selectedOptionId === option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    disabled={isClosed || hasUserBet}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/60 p-5 text-sm text-base-content/60">
                {t("pages.bets.detail.noOptions")}
              </div>
            )}
          </section>

          {/* BET NOW*/}
          <aside className="min-w-0 rounded-2xl border border-base-300 bg-base-200 p-5 shadow-xl md:p-6">
            <h2 className="text-2xl font-bold">
              {t("pages.bets.detail.placeBet")}
            </h2>
            <p className="mt-2 text-sm text-base-content/70">
              {t("pages.bets.detail.selection")}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex min-w-0 items-start justify-between gap-3 rounded-2xl border border-base-300 bg-base-200/70 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                    {t("pages.bets.detail.selectedOption")}
                  </p>
                  <p className="mt-2 wrap-wrap-break-word text-lg font-semibold">
                    {activeOptionLabel || t("pages.bets.detail.pickOption")}
                  </p>
                </div>
                {Number.isFinite(activeOdd) && (
                  <div className="shrink-0 self-center rounded-xl bg-base-100 px-3 py-2 text-md font-bold text-secondary sm:text-lg">
                    x{normalizeBetOdd(activeOdd)}
                  </div>
                )}
              </div>

              {!hasUserBet && (
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
                    disabled={isClosed || hasUserBet}
                  />
                </label>
              )}

              <div className="rounded-2xl border border-base-300 bg-base-200/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                  {t("pages.bets.detail.betSummary")}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 flex-1 text-base-content/70">
                    {t("pages.bets.detail.totalAmountBet")}
                  </span>
                  <p className="flex shrink-0 items-center gap-1 font-semibold">
                    {formatBetAmount(summaryAmount)}{" "}
                    <BitcoinSVG className="w-2 h-2" />
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 flex-1 text-base-content/70">
                    {t("pages.bets.detail.possibleOutcome")}
                  </span>
                  <p className="flex shrink-0 items-center gap-1 font-semibold text-success">
                    {formatBetAmount(possibleOutcome)}{" "}
                    <BitcoinSVG className="w-2 h-2" />
                  </p>
                </div>
              </div>

              {isClosed && (
                <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                  {t("pages.bets.detail.closedMessage")}
                </div>
              )}

              {hasUserBet ? (
                <div className="rounded-2xl border border-info/40 bg-info/10 p-4 text-sm text-info">
                  {t("pages.bets.detail.alreadyPlacedBlock")}
                </div>
              ) : (
                <Button
                  variant={isClosed ? "secondary" : "primary"}
                  className="w-full"
                  disabled={isSubmitDisabled}
                  onClick={() => onBet()}>
                  {t("pages.bets.detail.placeBet")}
                </Button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </GradientBg>
  )
}

export default BetDetailsPage
