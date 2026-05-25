"use strict"

import { useCallback, useState } from "react"

const isPayloadMethod = (method) =>
  ["POST", "PUT", "PATCH"].includes(method.toUpperCase())

const isMethodValid = (method) =>
  ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(
    method.toUpperCase(),
  )

const useAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (url, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      if (!options.method || !isMethodValid(options.method)) {
        throw new Error("Método invalido o no especificado")
      }

      const response = await fetch(url, {
        method: options.method,
        headers: {
          ...(isPayloadMethod(options.method) && {
            "Content-Type": "application/json",
          }),
          ...options.headers,
        },
        ...(isPayloadMethod(options.method) && {
          body: options.body ? JSON.stringify(options.body) : undefined,
        }),
      })

      // if (!response.ok) throw new Error(response.status)
      if (response.status === 204) {
        return { code: "SUCCESS" }
      }

      return await response.json()
    } catch (error) {
      setError(error.message || "Ocurrió un error al conectar con el servidor")
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback(
    async (url, options = {}) => await request(url, { method: "GET", ...options }),
    [request],
  )
  const post = useCallback(
    async (url, options = {}) => await request(url, { method: "POST", ...options }),
    [request],
  )
  const put = useCallback(
    async (url, options = {}) => await request(url, { method: "PUT", ...options }),
    [request],
  )
  const patch = useCallback(
    async (url, options = {}) => await request(url, { method: "PATCH", ...options }),
    [request],
  )
  const destroy = useCallback(
    async (url, options = {}) => await request(url, { method: "DELETE", ...options }),
    [request],
  )

  return { get, post, put, patch, destroy, loading, error }
}

export default useAPI
