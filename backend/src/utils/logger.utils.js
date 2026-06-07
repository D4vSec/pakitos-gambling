import pino from "pino"

const currentEnv = process.env.MODE_ENV ?? process.env.NODE_ENV
const isDev = currentEnv === "development" || currentEnv === "test"

const logger = pino({
    level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
    transport: isDev
        ? {
            target: "pino-pretty",
            options: {
                colorize: true,
            },
        }
        : undefined,
})

export default logger
export { logger, isDev }
