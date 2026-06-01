import { useEffect, useState } from "react"

const BREAKPOINTS = [
  { name: "2xl", minWidth: 1536 },
  { name: "xl", minWidth: 1280 },
  { name: "lg", minWidth: 1024 },
  { name: "md", minWidth: 768 },
  { name: "sm", minWidth: 640 },
]

const getCurrentBreakpoint = () => {
  if (typeof window === "undefined") {
    return "md"
  }

  const activeBreakpoint = BREAKPOINTS.find(
    ({ minWidth }) => window.innerWidth >= minWidth,
  )

  return activeBreakpoint?.name || "base"
}

const useCurrentBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint)

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint())
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return breakpoint
}

export default useCurrentBreakpoint
