import React, { createContext, useCallback, useContext, useState } from "react";
import useAPI from "@/hooks/useAPI";
import { useSession } from "@/providers/SessionProvider";
import { useNotification } from "@/providers/NotificationProvider";

const SlotsContext = createContext()

const SlotsProvider = ({ children }) => {
  const { post, get, destroy, loading: apiLoading } = useAPI()
  const { getAccessToken, getRefreshToken, setUser } = useSession()
  const { addNotification } = useNotification()

  const [session, setSession] = useState(null)
  const [spins, setSpins] = useState([])
  const [loading, setLoading] = useState(false)
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

      // update balance in session provider if present
      if (res.balance && setUser) {
        setUser((prev) => ({ ...prev, balance: String(res.balance) }))
      }

      return res
    } catch (err) {
      setError(err.message)
      addNotification(`Slots error: ${err.message}`, "error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const spin = async (gameId) => {
    setLoading(true)
    setError(null)
    try {
      const res = await post(`/api/v1/slots/${gameId}/spin`, {
        headers: authHeaders(),
      })

      if (!res || res.code) {
        throw new Error(res?.code || "UNKNOWN_ERROR")
      }

      // append spin result
      const spinResult = {
        spinNumber: res.spinNumber,
        grid: res.grid,
        winningLines: res.winningLines,
        payout: res.payout,
        isWinner: res.isWinner,
        balance: res.balance,
      }

      setSpins((s) => [...s, spinResult])

      // update session summary minimal fields
      setSession((prev) => (prev ? { ...prev, bet: res.bet } : prev))

      if (res.balance && setUser) {
        setUser((prev) => ({ ...prev, balance: String(res.balance) }))
      }

      return res
    } catch (err) {
      setError(err.message)
      addNotification(`Slots error: ${err.message}`, "error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getSession = async (gameId) => {
    setLoading(true)
    setError(null)
    try {
      const res = await get(`/api/v1/slots/${gameId}`, { headers: authHeaders() })
      if (!res || res.code) throw new Error(res?.code || "UNKNOWN_ERROR")

      setSession({
        gameId: res.gameId,
        machineType: res.machineType,
        bet: res.bet,
        totalSpins: res.totalSpins,
        totalPayout: res.totalPayout,
        createdAt: res.createdAt,
      })
      setSpins(res.spins || [])

      return res
    } catch (err) {
      setError(err.message)
      addNotification(`Slots error: ${err.message}`, "error")
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

      // clear local session state
      setSession(null)
      setSpins([])

      return res
    } catch (err) {
      setError(err.message)
      addNotification(`Slots error: ${err.message}`, "error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    createSession,
    spin,
    getSession,
    endSession,
    session,
    spins,
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
