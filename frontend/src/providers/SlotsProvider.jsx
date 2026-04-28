import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import useAPI from "@/hooks/useAPI"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"

const SlotsContext = createContext()

const gameIdKey = (type) => `slotsGameId_${type}`
const paylinesKey = (type) => `slotsPaylines_${type}`

const getStoredGameId = (type) => localStorage.getItem(gameIdKey(type))
const setStoredGameId = (type, id) => localStorage.setItem(gameIdKey(type), id)
const removeStoredGameId = (type) => localStorage.removeItem(gameIdKey(type))

const getStoredPaylines = (type) => {
  try {
    const raw = localStorage.getItem(paylinesKey(type))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
const setStoredPaylines = (type, paylines) =>
  localStorage.setItem(paylinesKey(type), JSON.stringify(paylines))
const removeStoredPaylines = (type) => localStorage.removeItem(paylinesKey(type))

const getDimensionsFromType = (machineType) => {
  const map = {
    "3x3": { rows: 3, cols: 3 },
    "3x5": { rows: 3, cols: 5 },
    "5x5": { rows: 5, cols: 5 },
  }
  return map[machineType] ?? { rows: 3, cols: 5 }
}

const SlotsProvider = ({ type = "3x3", children }) => {
  const { post, get, destroy, loading: apiLoading } = useAPI()
  const { getAccessToken, getRefreshToken, setUser } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const [session, setSession] = useState(null)
  const [spins, setSpins] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [error, setError] = useState(null)

  const authHeaders = useCallback(() => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()
    return {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
    }
  }, [getAccessToken, getRefreshToken])

  const createSession = async ({ type = "3x5", amount }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await post("/api/v1/slots/create", {
        headers: authHeaders(),
        body: { type, amount },
      })

      if (!res || res.code) {
        throw new Error(res?.code || "UNKNOWN_ERROR")
      }

      const newSession = {
        gameId: res.gameId,
        machineType: res.machineType,
        bet: res.bet,
        rows: res.rows,
        cols: res.cols,
        paylines: res.paylines,
      }
      setSession(newSession)
      setSpins([])
      setStoredGameId(type, res.gameId)
      setStoredPaylines(type, res.paylines)

      if (res.balance != null) {
        setUser((prev) => ({ ...prev, balance: Number(res.balance).toFixed(2) }))
      }

      return res
    } catch (err) {
      setError(err.message)
      addNotification(t(`message.error.${err.message}`) || err.message, "error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const spin = async (gameId) => {
    setLoading(true)
    setIsSpinning(true)
    setError(null)
    try {
      const res = await post(`/api/v1/slots/${gameId}/spin`, {
        headers: authHeaders(),
      })

      if (!res || res.code) {
        throw new Error(res?.code || "UNKNOWN_ERROR")
      }

      const spinResult = {
        spinNumber: res.spinNumber,
        grid: res.grid,
        winningLines: res.winningLines,
        payout: res.payout,
        isWinner: res.isWinner,
        balance: res.balance,
      }

      setSpins((s) => [...s, spinResult])

      // Balance is applied by SlotControls after the animation completes,
      // so the player sees the result before the number changes.

      return res
    } catch (err) {
      setError(err.message)
      addNotification(t(`message.error.${err.message}`) || err.message, "error")
      throw err
    } finally {
      setLoading(false)
      setIsSpinning(false)
    }
  }

  const getSession = async (gameId) => {
    setLoading(true)
    setError(null)
    try {
      const res = await get(`/api/v1/slots/${gameId}`, { headers: authHeaders() })
      if (!res || res.code) throw new Error(res?.code || "UNKNOWN_ERROR")

      const { rows, cols } = getDimensionsFromType(res.machineType)
      const paylines = getStoredPaylines(type)

      setSession({
        gameId: res.gameId,
        machineType: res.machineType,
        bet: res.bet,
        rows,
        cols,
        paylines,
        totalSpins: res.totalSpins,
        totalPayout: res.totalPayout,
        createdAt: res.createdAt,
      })
      setSpins(res.spins || [])

      return res
    } catch (err) {
      setError(err.message)
      addNotification(t(`message.error.${err.message}`) || err.message, "error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const endSession = async (gameId) => {
    setLoading(true)
    setError(null)
    try {
      const res = await destroy(`/api/v1/slots/${gameId}`, { headers: authHeaders() })
      if (!res || res.code) throw new Error(res?.code || "UNKNOWN_ERROR")

      setSession(null)
      setSpins([])
      removeStoredGameId(type)
      removeStoredPaylines(type)

      return res
    } catch (err) {
      setError(err.message)
      addNotification(t(`message.error.${err.message}`) || err.message, "error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedId = getStoredGameId(type)
    if (storedId) {
      getSession(storedId).catch(() => {
        removeStoredGameId(type)
        removeStoredPaylines(type)
      })
    }
  }, [])

  const value = {
    createSession,
    spin,
    getSession,
    endSession,
    session,
    spins,
    isSpinning,
    loading: loading || apiLoading,
    error,
  }

  return <SlotsContext.Provider value={value}>{children}</SlotsContext.Provider>
}

export default SlotsProvider

export const useSlots = () => {
  const context = useContext(SlotsContext)
  if (!context) throw new Error("useSlots must be used within SlotsProvider")
  return context
}
