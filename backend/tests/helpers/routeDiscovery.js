import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const backendRoot = path.resolve(currentDir, '..', '..')
const srcRoot = path.join(backendRoot, 'src')

const normalizePath = (basePath, routePath) => {
	const fullPath = `${basePath}${routePath === '/' ? '' : routePath}`

	return fullPath.replace(/\/+/g, '/').replace(/:(\w+)/g, '1')
}

const getDiscoveredRoutes = () => {
	const appSource = fs.readFileSync(path.join(srcRoot, 'app.js'), 'utf8')
	const apiVersionMatch = appSource.match(/const API_VERSION = ['"]([^'"]+)['"]/)
	const apiVersion = apiVersionMatch?.[1]

	if (!apiVersion) {
		throw new Error('API_VERSION could not be resolved from src/app.js')
	}

	const routeImports = new Map(
		Array.from(
			appSource.matchAll(/import\s+(\w+)\s+from\s+['"]#routes\/([^'"]+)['"]/g),
			(match) => [match[1], match[2]],
		),
	)

	const routeMounts = Array.from(
		appSource.matchAll(/app\.use\(`\/\$\{API_VERSION\}([^`]*)`,\s*(\w+)\)/g),
		(match) => {
			const routeModule = routeImports.get(match[2])
			if (!routeModule) return null

			return {
				basePath: `/${apiVersion}${match[1]}`,
				routeModule,
			}
		},
	).filter(Boolean)

	return routeMounts
		.flatMap(({ basePath, routeModule }) => {
			const routeSource = fs.readFileSync(
				path.join(srcRoot, 'routes', `${routeModule}.js`),
				'utf8',
			)

			return Array.from(
				routeSource.matchAll(
					/\w+\.(get|post|put|delete|patch)\((['"])([^'"]+)\2,\s*([^)]+)\)/g,
				),
				(match) => ({
					method: match[1],
					path: normalizePath(basePath, match[3]),
					isProtected: match[4].includes('authMiddleware'),
					isAdmin: match[4].includes('adminMiddleware'),
				}),
			)
		})
		.sort(
			(left, right) =>
				left.path.localeCompare(right.path) ||
				left.method.localeCompare(right.method),
		)
}

export { getDiscoveredRoutes }
