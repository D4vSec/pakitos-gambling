import { mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const cacheRoot = path.join(projectRoot, ".cache", "react-doctor")
const appDataDir = path.join(cacheRoot, "appdata")
const configDir = path.join(cacheRoot, "xdg-config")
const homeDir = path.join(cacheRoot, "home")

for (const directory of [appDataDir, configDir, homeDir]) {
  mkdirSync(directory, { recursive: true })
}

const cliPath = path.join(
  projectRoot,
  "node_modules",
  "react-doctor",
  "bin",
  "react-doctor.js",
)

const args = process.argv.slice(2)
const doctorArgs = args.length > 0 ? args : ["."]

const result = spawnSync(process.execPath, [cliPath, ...doctorArgs], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    APPDATA: appDataDir,
    XDG_CONFIG_HOME: configDir,
    HOME: homeDir,
    USERPROFILE: homeDir,
  },
})

if (typeof result.status === "number") {
  process.exit(result.status)
}

process.exit(1)
