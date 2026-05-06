"use strict"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs().tz("Europe/Madrid").format("DD/MM/YYYY HH:mm:ss z")

const buildUserAgent = (userAgent = {}) => {
  const { browser, version, os, platform, isMobile, isTablet, isDesktop } =
    JSON.parse(userAgent)
  const clean = (v) => v && v !== "unknown"

  const browserPart = browser
    ? version
      ? `${browser} v.${version}`
      : browser
    : null

  const systemParts = [platform, os].filter(clean)
  const systemPart = systemParts.length ? `(${systemParts.join(" | ")})` : null

  let devicePart = null
  if (isMobile) devicePart = "Mobile"
  else if (isTablet) devicePart = "Tablet"
  else if (isDesktop) devicePart = "Desktop"

  return [browserPart, systemPart, devicePart].filter(Boolean).join(" ")
}

const fullDateFormatter = (date) => dayjs(date).format("DD/MM/YYYY HH:mm:ss Z")

export { buildUserAgent, fullDateFormatter }
