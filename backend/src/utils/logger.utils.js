import pino from "pino"

const currentEnv = process.env.MODE_ENV ?? process.env.NODE_ENV
const isDev = currentEnv === "development" || currentEnv === "test"

const logger = pino({
    level: isDev ? "debug" : "fatal",
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
