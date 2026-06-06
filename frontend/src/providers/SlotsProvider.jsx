import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import useAPI from "@/hooks/useAPI"
import { useSession } from "@/providers/SessionProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useLocale } from "@/providers/LocaleProvider"

const SlotsContext = createContext()

const resolveApiErrorCode = (responseOrError, fallback = "SERVER_ERROR") => {
  if (typeof responseOrError?.code === "string" && responseOrError.code.trim()) {
    return responseOrError.code
  }

  if (typeof responseOrError?.message === "string" && responseOrError.message.trim()) {
    return responseOrError.message
  }

  return fallback
}

const SlotsProvider = ({ type: defaultType = "3x3", slotKey = "default", children }) => {
  const { post, destroy, loading: apiLoading } = useAPI()
  const { getAccessToken, getRefreshToken, setUser } = useSession()
  const { addNotification } = useNotification()
  const { t } = useLocale()

  const [type, setType] = useState(defaultType)
  const [session, setSession] = useState(null)
  const [spins, setSpins] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [error, setError] = useState(null)
  const sessionRef = useRef(null)
  const destroyRef = useRef(destroy)
  const authHeadersRef = useRef(() => ({}))
  const previousSlotKeyRef = useRef(slotKey)

  useEffect(() => {
    setType(defaultType)
  }, [defaultType, slotKey])

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    destroyRef.current = destroy
  }, [destroy])

  const authHeaders = useCallback(() => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()
    return {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
    }
  }, [getAccessToken, getRefreshToken])

  useEffect(() => {
    authHeadersRef.current = authHeaders
  }, [authHeaders])

  const getErrorMessage = useCallback(
    (responseOrError) => {
      const code = resolveApiErrorCode(responseOrError)
      const translationKey = `message.error.${code}`
      const translatedMessage = t(translationKey)

      return translatedMessage === translationKey
        ? t("message.error.SERVER_ERROR")
        : translatedMessage
    },
    [t],
  )

  const syncUserBalance = useCallback(
    (balance) => {
      const nextBalance = Number(balance)
      if (!Number.isFinite(nextBalance)) return

      setUser((prev) => ({
        ...prev,
        balance: nextBalance.toFixed(2),
      }))
    },
    [setUser],
  )

  const clearLocalSession = useCallback(() => {
    setSession(null)
    setSpins([])
  }, [])

  const closeSession = useCallback(
    async (gameId) => {
      if (!gameId) return null

      setLoading(true)
      setError(null)
      try {
        const res = await destroy(`/api/v1/slots/${gameId}`, {
          headers: authHeaders(),
        })
        if (!res || res.code) throw new Error(resolveApiErrorCode(res))

        clearLocalSession()
        return res
      } catch (err) {
        setError(err.message)
        addNotification(getErrorMessage(err), "error")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [addNotification, authHeaders, clearLocalSession, destroy, getErrorMessage],
  )

  const createSession = async ({ type: sessionType = type, amount }) => {
    setLoading(true)
    setError(null)
    try {
      if (sessionRef.current?.gameId) {
        await destroy(`/api/v1/slots/${sessionRef.current.gameId}`, {
          headers: authHeaders(),
        })
        clearLocalSession()
      }

      const res = await post("/api/v1/slots/create", {
        headers: authHeaders(),
        body: { type: sessionType, amount },
      })

      if (!res || res.code) {
        throw new Error(resolveApiErrorCode(res))
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
      setType(res.machineType)
      syncUserBalance(res.balance)

      return res
    } catch (err) {
      setError(err.message)
      addNotification(getErrorMessage(err), "error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const spin = async (gameInput) => {
    const gameId =
      typeof gameInput === "object" && gameInput !== null ? gameInput.gameId : gameInput
    const sessionBet =
      typeof gameInput === "object" && gameInput !== null ? gameInput.bet : undefined
    const sessionMachineType =
      typeof gameInput === "object" && gameInput !== null ? gameInput.machineType : undefined

    setLoading(true)
    setIsSpinning(true)
    setError(null)
    const MIN_SPIN_MS = 2500
    const t0 = Date.now()
    try {
      const betAmount = Number(sessionBet ?? session?.bet ?? 0)
      const res = await post(`/api/v1/slots/${gameId}/spin`, {
        headers: authHeaders(),
      })

      if (!res || res.code) {
        throw new Error(resolveApiErrorCode(res))
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

      return res
    } catch (err) {
      setError(err.message)
      addNotification(getErrorMessage(err), "error")
      throw err
    } finally {
      const elapsed = Date.now() - t0
      const remaining = MIN_SPIN_MS - elapsed
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining))
      setLoading(false)
      setIsSpinning(false)
    }
  }

  useEffect(() => {
    if (previousSlotKeyRef.current === slotKey) return

    previousSlotKeyRef.current = slotKey
    if (!sessionRef.current?.gameId) return

    closeSession(sessionRef.current.gameId).catch(() => {
      clearLocalSession()
    })
  }, [clearLocalSession, closeSession, slotKey])

  useEffect(() => {
    return () => {
      const activeGameId = sessionRef.current?.gameId
      if (!activeGameId) return

      destroyRef
        .current(`/api/v1/slots/${activeGameId}`, {
          headers: authHeadersRef.current(),
        })
        .catch(() => null)
    }
  }, [])

  const changeType = useCallback(
    async (nextType) => {
      if (nextType === type) return

      if (sessionRef.current?.gameId) {
        await closeSession(sessionRef.current.gameId).catch(() => {
          clearLocalSession()
        })
      }

      setType(nextType)
    },
    [clearLocalSession, closeSession, type],
  )

  const value = {
    type,
    setType: changeType,
    defaultType,
    createSession,
    spin,
    closeSession,
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
