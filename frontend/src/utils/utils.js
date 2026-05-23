"use strict"

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return ""
  const [year, month, day] = dateStr.split("-")
  return `${day}-${month}-${year}`
}

export { formatDateDisplay }
