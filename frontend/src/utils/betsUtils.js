import dayjs from "dayjs"

const formatBetDate = (date) => {
  if (!date) return ""

  return dayjs(date).format("DD/MM/YYYY HH:mm")
}

const toDateTimeLocalValue = (date) => {
  if (!date) return ""

  return dayjs(date).format("YYYY-MM-DDTHH:mm")
}

const getBetStatusVariant = (status) => {
  if (status === "open") return "success"
  if (status === "closed") return "error"

  return "secondary"
}

const normalizeBetOdd = (odd) => {
  const numericOdd = Number(odd)

  if (!Number.isFinite(numericOdd)) return "--"

  return numericOdd.toFixed(2)
}

const formatBetAmount = (amount) => {
  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount)) return "--"

  return numericAmount.toFixed(2)
}

const sortBetOptions = (options = []) =>
  [...options].sort(
    (firstOption, secondOption) =>
      Number(secondOption.odd) - Number(firstOption.odd),
  )

export {
  formatBetAmount,
  formatBetDate,
  getBetStatusVariant,
  normalizeBetOdd,
  sortBetOptions,
  toDateTimeLocalValue,
}
