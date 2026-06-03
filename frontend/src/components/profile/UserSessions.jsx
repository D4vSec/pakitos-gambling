import React, { useEffect, useMemo, useState } from "react"
import {
  IconCircleCheck,
  IconCircleX,
  IconDevices,
  IconTrashX,
} from "@tabler/icons-react"
import useAPI from "@/hooks/useAPI"
import { useSession } from "@/providers/SessionProvider"
import { useLocale } from "@/providers/LocaleProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { buildUserAgent, fullDateFormatter } from "@/utils/adminUtils"

const safeBuildUserAgent = (deviceInfo) => {
  if (!deviceInfo) return "-"

  try {
    return buildUserAgent(deviceInfo) || "-"
  } catch {
    return "-"
  }
}

const UserSessions = ({ userId, className = "", shadow = true }) => {
  const { get, destroy } = useAPI()
  const { getAccessToken, getRefreshToken } = useSession()
  const { t } = useLocale()
  const { addNotification } = useNotification()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [revokingSessionId, setRevokingSessionId] = useState(null)

  const headers = useMemo(
    () => ({
      ...(getRefreshToken() ? { "x-refresh-token": getRefreshToken() } : {}),
      ...(getAccessToken()
        ? { Authorization: `Bearer ${getAccessToken()}` }
        : {}),
    }),
    [getAccessToken, getRefreshToken],
  )

  const sessionsUrl = userId
    ? `/api/v1/user/${userId}/sessions`
    : "/api/v1/user/me/sessions"

  useEffect(() => {
    let isActive = true

    const loadSessions = async () => {
      setLoading(true)
      const res = await get(sessionsUrl, { headers })

      if (!isActive) return

      setSessions(res?.sessions || [])
      setLoading(false)
    }

    loadSessions()

    return () => {
      isActive = false
    }
  }, [get, headers, sessionsUrl])

  const handleRevokeSession = async (sessionId) => {
    setRevokingSessionId(sessionId)

    try {
      const res = await destroy(`${sessionsUrl}/${sessionId}`, { headers })

      if (res?.code !== "SUCCESS") {
        throw new Error(res?.code || "UNKNOWN_ERROR")
      }

      setSessions((currentSessions) =>
        currentSessions.map((session) =>
          session.id === sessionId ? { ...session, revoked: true } : session,
        ),
      )
      addNotification(t("message.success.SESSION_REVOKED"), "success")
    } catch (error) {
      addNotification(t(`message.error.${error.message}`), "error")
    } finally {
      setRevokingSessionId(null)
    }
  }

  return (
    <section
      className={`card bg-base-100 ${shadow ? "shadow-xl" : ""} ${className}`}
    >
      <div className="card-body">
        <h2 className="card-title text-xl">
          <IconDevices />
          {t("adminPanel.userDetails.sessions.title")}
        </h2>

        <div className="w-full min-w-0 max-w-full rounded-lg bg-base-200 p-4">
          <div className="w-full min-w-0 max-w-full overflow-x-auto">
            <table className="table table-sm sm:table-md rounded-md">
              <thead>
                <tr className="bg-base-100">
                  <th className="whitespace-nowrap">
                    {t("adminPanel.userDetails.sessions.table.device")}
                  </th>
                  <th className="whitespace-nowrap">
                    {t("adminPanel.userDetails.sessions.table.status")}
                  </th>
                  <th className="whitespace-nowrap">
                    {t("adminPanel.userDetails.sessions.table.createdAt")}
                  </th>
                  <th className="whitespace-nowrap">
                    {t("adminPanel.userDetails.sessions.table.expiresAt")}
                  </th>
                  <th className="whitespace-nowrap">
                    {t("adminPanel.userDetails.sessions.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center">
                      <span className="loading loading-spinner loading-xs sm:loading-sm mr-1"></span>
                      {t("message.info.loading")}
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center">
                      {t("ui.tables.noData")}
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => {
                    const isExpired =
                      session.expires_at &&
                      new Date(session.expires_at) < new Date()
                    const statusKey = session.revoked
                      ? "revoked"
                      : isExpired
                        ? "expired"
                        : "active"
                    const statusClass = {
                      active: "badge-success",
                      expired: "badge-warning",
                      revoked: "badge-error",
                    }[statusKey]

                    return (
                      <tr
                        key={session.id}
                        className="odd:bg-neutral hover:bg-base-300 transition-colors"
                      >
                        <td className="min-w-56">
                          {safeBuildUserAgent(session.device_info)}
                        </td>
                        <td className="whitespace-nowrap">
                          <span className={`badge gap-1 ${statusClass}`}>
                            {statusKey === "active" ? (
                              <IconCircleCheck className="h-4 w-4" />
                            ) : (
                              <IconCircleX className="h-4 w-4" />
                            )}
                            {t(
                              `adminPanel.userDetails.sessions.status.${statusKey}`,
                            )}
                          </span>
                        </td>
                        <td className="whitespace-nowrap">
                          {fullDateFormatter(session.created_at)}
                        </td>
                        <td className="whitespace-nowrap">
                          {fullDateFormatter(session.expires_at)}
                        </td>
                        <td className="whitespace-nowrap">
                          <button
                            type="button"
                            className="btn btn-error btn-sm btn-square"
                            aria-label={t(
                              "adminPanel.userDetails.sessions.table.remove",
                            )}
                            disabled={
                              session.revoked ||
                              revokingSessionId === session.id
                            }
                            onClick={() => handleRevokeSession(session.id)}
                          >
                            {revokingSessionId === session.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <IconTrashX className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserSessions
