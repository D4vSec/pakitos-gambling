import { useCallback } from "react"
import useAPI from "./useAPI"
import { useLocale } from "@/providers/LocaleProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { useSession } from "@/providers/SessionProvider"

const useBets = () => {
  const { get, post } = useAPI()
  const { t } = useLocale()
  const { addNotification } = useNotification()
  const { getAccessToken, getRefreshToken, updateBalance } = useSession()

  const buildHeaders = useCallback(() => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    return {
      ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }
  }, [getAccessToken, getRefreshToken])

  const notifyError = useCallback(
    (error) => {
      addNotification(t(`message.error.${error?.message}`), "error")
    },
    [addNotification, t],
  )

  const getBets = useCallback(
    async (filters = {}) => {
      try {
        const queryParams = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "" && value !== "all") {
            queryParams.append(key, value)
          }
        })

        const query = queryParams.toString()
        const response = await get(query ? `/api/v1/bets?${query}` : "/api/v1/bets", {
          headers: buildHeaders(),
        })

        if (response?.code) {
          throw new Error(response.code)
        }

        return Array.isArray(response) ? response : []
      } catch (error) {
        notifyError(error)
        return []
      }
    },
    [buildHeaders, get, notifyError],
  )

  const getBetOptions = useCallback(
    async (betId) => {
      try {
        const response = await get(`/api/v1/bets/${betId}`, {
          headers: buildHeaders(),
        })

        if (response?.code) {
          throw new Error(response.code)
        }

        return Array.isArray(response) ? response : []
      } catch (error) {
        notifyError(error)
        return []
      }
    },
    [buildHeaders, get, notifyError],
  )

  const placeBet = useCallback(
    async (betId, payload) => {
      try {
        const response = await post(`/api/v1/bets/${betId}/place`, {
          headers: buildHeaders(),
          body: payload,
        })

        if (response?.code) {
          throw new Error(response.code)
        }

        updateBalance("withdrawal", payload.amount)
        addNotification(t("message.success.BET_PLACED"), "success")

        return response
      } catch (error) {
        notifyError(error)
        return null
      }
    },
    [addNotification, buildHeaders, notifyError, post, t, updateBalance],
  )

  return {
    getBets,
    getBetOptions,
    placeBet,
  }
}

export default useBets
