import pino from "pino"

const isDev = (process.env.MODE_ENV ?? process.env.NODE_ENV) === "development"

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