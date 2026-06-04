import React, { useEffect, useMemo, useState, useCallback } from "react"
import {
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRightFilled,
  IconChevronRightPipe,
  IconDevices,
  IconTrashX,
} from "@tabler/icons-react"
import useAPI from "@/hooks/useAPI"
import { useSession } from "@/providers/SessionProvider"
import { useLocale } from "@/providers/LocaleProvider"
import { useNotification } from "@/providers/NotificationProvider"
import { buildUserAgent, fullDateFormatter } from "@/utils/adminUtils"
import Button from "../buttons/Button"
import SessionStatusBadge from "../badges/SessionStatusBadge"

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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const buildHeaders = useCallback(() => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    return {
      ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }
  }, [getAccessToken, getRefreshToken])

  const sessionsUrl = userId
    ? `/api/v1/user/${userId}/sessions`
    : "/api/v1/user/me/sessions"

  const totalPages = Math.max(1, Math.ceil(sessions.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginatedSessions = useMemo(() => {
    const start = (safePage - 1) * pageSize

    return sessions.slice(start, start + pageSize)
  }, [pageSize, safePage, sessions])
  const iconOnlyButtonClass = "px-2 sm:px-3"

  const paginationButtons = [
    {
      key: "first",
      label: t("ui.tables.paginationBar.first"),
      icon: <IconChevronLeftPipe />,
      onClick: () => setPage(1),
      disabled: safePage === 1,
    },
    {
      key: "prev",
      label: t("ui.tables.paginationBar.prev"),
      icon: <IconChevronLeft />,
      onClick: () => setPage((currentPage) => Math.max(1, currentPage - 1)),
      disabled: safePage === 1,
    },
    {
      key: "next",
      label: t("ui.tables.paginationBar.next"),
      icon: <IconChevronRightFilled />,
      onClick: () =>
        setPage((currentPage) => Math.min(totalPages, currentPage + 1)),
      disabled: safePage === totalPages,
    },
    {
      key: "last",
      label: t("ui.tables.paginationBar.last"),
      icon: <IconChevronRightPipe />,
      onClick: () => setPage(totalPages),
      disabled: safePage === totalPages,
    },
  ]

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  useEffect(() => {
    let isActive = true

    const loadSessions = async () => {
      setLoading(true)
      const res = await get(sessionsUrl, { headers: buildHeaders() })

      if (!isActive) return

      setSessions(res?.sessions || [])
      setPage(1)
      setLoading(false)
    }

    loadSessions()

    return () => {
      isActive = false
    }
  }, [buildHeaders, get, sessionsUrl])

  const handleRevokeSession = async (sessionId) => {
    setRevokingSessionId(sessionId)

    try {
      const res = await destroy(`${sessionsUrl}/${sessionId}`, {
        headers: buildHeaders(),
      })

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

  const confirmRevokeSession = (sessionId) => {
    addNotification(t("message.modal.revokeSession.title"), "modal", {
      onAccept: async () => {
        await handleRevokeSession(sessionId)
      },
      acceptLabel: t("message.modal.revokeSession.accept"),
      cancelLabel: t("message.modal.revokeSession.cancel"),
    })
  }

  return (
    <section
      className={`card bg-base-100 ${shadow ? "shadow-xl" : ""} ${className}`}>
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
                  paginatedSessions.map((session) => {
                    const isExpired =
                      session.expires_at &&
                      new Date(session.expires_at) < new Date()
                    const statusKey = session.revoked
                      ? "revoked"
                      : isExpired
                        ? "expired"
                        : "active"
                    return (
                      <tr
                        key={session.id}
                        className="odd:bg-neutral hover:bg-base-300 transition-colors">
                        <td className="min-w-56">
                          {safeBuildUserAgent(session.device_info)}
                        </td>
                        <td className="whitespace-nowrap">
                          <SessionStatusBadge status={statusKey} />
                        </td>
                        <td className="whitespace-nowrap">
                          {fullDateFormatter(session.created_at)}
                        </td>
                        <td className="whitespace-nowrap">
                          {fullDateFormatter(session.expires_at)}
                        </td>
                        <td className="whitespace-nowrap">
                          <div
                            className={`tooltip tooltip-top cursor-pointer tooltip-error`}
                            data-tip={t(
                              "adminPanel.userDetails.sessions.table.remove",
                            )}>
                            <Button
                              variant="error"
                              size="sm"
                              disabled={
                                session.revoked ||
                                revokingSessionId === session.id
                              }
                              onClick={() => confirmRevokeSession(session.id)}>
                              {revokingSessionId === session.id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <IconTrashX />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && sessions.length > 0 && (
            <div className="mt-4 flex flex-col gap-3 md:flex-row w-full items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {paginationButtons.slice(0, 2).map((button) => (
                  <Button
                    key={button.key}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className={`btn-outline ${iconOnlyButtonClass}`}
                    onClick={button.onClick}
                    disabled={button.disabled}>
                    <span className="hidden sm:inline">{button.label}</span>
                    <span className="sm:hidden">{button.icon}</span>
                  </Button>
                ))}

                <span className="min-w-18 text-center text-sm font-medium sm:min-w-22">
                  {safePage} / {totalPages || 1}
                </span>

                {paginationButtons.slice(2).map((button) => (
                  <Button
                    key={button.key}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className={`btn-outline ${iconOnlyButtonClass}`}
                    onClick={button.onClick}
                    disabled={button.disabled}>
                    <span className="hidden sm:inline">{button.label}</span>
                    <span className="sm:hidden">{button.icon}</span>
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-start">
                <span className="text-sm whitespace-nowrap">
                  {t("ui.tables.paginationBar.rowsPerPage")}
                </span>
                <select
                  className="select select-bordered select-sm w-full min-w-0 sm:w-auto sm:min-w-24 md:select-md"
                  value={pageSize}
                  onChange={(e) => {
                    const nextSize = Number(e.target.value)
                    setPageSize(nextSize)
                    setPage(1)
                  }}>
                  {[1, 5, 10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UserSessions
