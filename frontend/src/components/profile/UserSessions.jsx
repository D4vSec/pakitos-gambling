import React, { useCallback, useMemo, useState } from "react"
import {
  IconCircleCheck,
  IconCircleX,
  IconDevices,
  IconTrashX,
} from "@tabler/icons-react"
import Button from "@/components/buttons/Button"
import Badge from "@/components/badges/Badge"
import Table from "@/components/admin/tables/Table"
import useAPI from "@/hooks/useAPI"
import useTable from "@/hooks/useTable"
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

const getSessionStatus = (session) => {
  const isExpired =
    session.expires_at && new Date(session.expires_at) < new Date()

  if (session.revoked) return "revoked"
  if (isExpired) return "expired"

  return "active"
}

const getSessionSortValue = (session, columnId) => {
  switch (columnId) {
    case "device_info":
      return safeBuildUserAgent(session.device_info).toLowerCase()
    case "status":
      return {
        active: 0,
        expired: 1,
        revoked: 2,
      }[getSessionStatus(session)]
    case "created_at":
      return session.created_at ? new Date(session.created_at).getTime() : 0
    case "expires_at":
      return session.expires_at ? new Date(session.expires_at).getTime() : 0
    default:
      return session[columnId]
  }
}

const compareSessionValues = (leftValue, rightValue) => {
  if (leftValue == null && rightValue == null) return 0
  if (leftValue == null) return -1
  if (rightValue == null) return 1

  if (typeof leftValue === "string" && typeof rightValue === "string") {
    return leftValue.localeCompare(rightValue)
  }

  if (leftValue > rightValue) return 1
  if (leftValue < rightValue) return -1

  return 0
}

const UserSessions = ({ userId, className = "", shadow = true }) => {
  const { get, destroy } = useAPI()
  const { getAccessToken, getRefreshToken } = useSession()
  const { t } = useLocale()
  const { addNotification } = useNotification()
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

  const fetchSessions = useCallback(
    async (params = {}) => {
      const res = await get(sessionsUrl, { headers })
      const allSessions = res?.sessions || []
      const { page = 1, limit = 5, sortBy, sortOrder = "none" } = params

      const sortedSessions =
        sortBy && sortOrder !== "none"
          ? [...allSessions].sort((leftSession, rightSession) => {
              const result = compareSessionValues(
                getSessionSortValue(leftSession, sortBy),
                getSessionSortValue(rightSession, sortBy),
              )

              return sortOrder === "desc" ? -result : result
            })
          : allSessions

      const currentPage = Math.max(1, page)
      const pageSize = Math.max(1, limit)
      const totalPages = Math.max(
        1,
        Math.ceil(sortedSessions.length / pageSize),
      )
      const normalizedPage = Math.min(currentPage, totalPages)
      const start = (normalizedPage - 1) * pageSize

      return {
        sessions: sortedSessions.slice(start, start + pageSize),
        totalPages,
      }
    },
    [get, headers, sessionsUrl],
  )

  const {
    data,
    isLoading,
    pagination,
    setPagination,
    sorting,
    setSorting,
    refresh,
  } = useTable(fetchSessions, {}, [])

  const handleRevokeSession = useCallback(
    async (sessionId) => {
      setRevokingSessionId(sessionId)

      try {
        const res = await destroy(`${sessionsUrl}/${sessionId}`, { headers })

        if (res?.code !== "SUCCESS") {
          throw new Error(res?.code || "UNKNOWN_ERROR")
        }

        await refresh()
        addNotification(t("message.success.SESSION_REVOKED"), "success")
      } catch (error) {
        addNotification(t(`message.error.${error.message}`), "error")
      } finally {
        setRevokingSessionId(null)
      }
    },
    [addNotification, destroy, headers, refresh, sessionsUrl, t],
  )

  const confirmRevokeSession = useCallback(
    (sessionId) =>
      addNotification(t("message.modal.revokeSession.title"), "modal", {
        onAccept: () => handleRevokeSession(sessionId),
        acceptLabel: t("message.modal.revokeSession.accept"),
        cancelLabel: t("message.modal.revokeSession.cancel"),
      }),
    [addNotification, handleRevokeSession, t],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: "device_info",
        header: t("adminPanel.userDetails.sessions.table.device"),
        cell: ({ row }) => safeBuildUserAgent(row.original.device_info),
      },
      {
        id: "status",
        header: t("adminPanel.userDetails.sessions.table.status"),
        cell: ({ row }) => {
          const session = row.original
          const statusKey = getSessionStatus(session)
          const statusVariant = {
            active: "success",
            expired: "warning",
            revoked: "error",
          }[statusKey]

          return (
            <Badge
              variant={statusVariant}
              size="sm"
              svg={
                statusKey === "active" ? (
                  <IconCircleCheck className="h-4 w-4" />
                ) : (
                  <IconCircleX className="h-4 w-4" />
                )
              }>
              {t(`adminPanel.userDetails.sessions.status.${statusKey}`)}
            </Badge>
          )
        },
      },
      {
        accessorKey: "created_at",
        header: t("adminPanel.userDetails.sessions.table.createdAt"),
        cell: ({ row }) => fullDateFormatter(row.original.created_at),
      },
      {
        accessorKey: "expires_at",
        header: t("adminPanel.userDetails.sessions.table.expiresAt"),
        cell: ({ row }) => fullDateFormatter(row.original.expires_at),
      },
      {
        id: "actions",
        header: t("adminPanel.userDetails.sessions.table.actions"),
        enableSorting: false,
        cell: ({ row }) => {
          const session = row.original

          return (
            <div
              className={
                revokingSessionId === session.id
                  ? "tooltip tooltip-top cursor-pointer tooltip-error"
                  : ""
              }
              data-tip={t("adminPanel.userDetails.sessions.table.remove")}>
              <Button
                type="button"
                variant="error"
                size="sm"
                svg={
                  revokingSessionId === session.id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <IconTrashX />
                  )
                }
                onClick={() => confirmRevokeSession(session.id)}
                disabled={session.revoked || revokingSessionId === session.id}
              />
            </div>
          )
        },
      },
    ],
    [confirmRevokeSession, revokingSessionId, t],
  )

  return (
    <section
      className={`card bg-base-100 ${shadow ? "shadow-xl" : ""} ${className}`}>
      <div className="card-body">
        <h2 className="card-title text-xl">
          <IconDevices />
          {t("adminPanel.userDetails.sessions.title")}
        </h2>

        <Table
          data={data?.sessions || []}
          columns={columns}
          pageCount={data?.totalPages || 0}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
    </section>
  )
}

export default UserSessions
