"use strict"

import { useState } from "react"

const useAPI = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const isPayloadMethod = (method) => ["POST", "PUT", "PATCH"].includes(method.toUpperCase())
    const isMethodValid = (method) =>
        ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(method.toUpperCase())

    const request = async (url, options = {}) => {
        setLoading(true)
        setError(null)

        try {
            if (!options.method || !isMethodValid(options.method)) {
                throw new Error("Método invalido o no especificado")
            }

            const response = await fetch(url, {
                method: options.method,
                headers: {
                    ...(isPayloadMethod(options.method) && { "Content-Type": "application/json" }),
                    ...options.headers,
                },
                ...(isPayloadMethod(options.method) && {
                    body: options.body ? JSON.stringify(options.body) : undefined,
                }),
            })

            // if (!response.ok) throw new Error(response.status)

            return await response.json()
        } catch (error) {
            setError(error.message || "Ocurrió un error al conectar con el servidor")
            throw error
        } finally {
            setLoading(false)
        }
    }

    const get = async (url, options = {}) => await request(url, { method: "GET", ...options })
    const post = async (url, options = {}) => await request(url, { method: "POST", ...options })
    const put = async (url, options = {}) => await request(url, { method: "PUT", ...options })
    const patch = async (url, options = {}) => await request(url, { method: "PATCH", ...options })
    const destroy = async (url, options = {}) =>
        await request(url, { method: "DELETE", ...options })

    return { get, post, put, patch, destroy, loading, error }
}

export default useAPI
