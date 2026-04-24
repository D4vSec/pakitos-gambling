import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import request from 'supertest'

import { logIfVerbose } from '../constants.js'
import app from '../../src/app.js'

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

	const routeImports = new Map(Array.from(appSource.matchAll(/import\s+(\w+)\s+from\s+['"]#routes\/([^'"]+)['"]/g), (match) => [match[1], match[2]]))

	const routeMounts = Array.from(appSource.matchAll(/app\.use\(`\/\$\{API_VERSION\}([^`]*)`,\s*(\w+)\)/g), (match) => {
		const routeModule = routeImports.get(match[2])
		if (!routeModule) return null

		return {
			basePath: `/${apiVersion}${match[1]}`,
			routeModule,
		}
	}).filter(Boolean)

	return routeMounts
		.flatMap(({ basePath, routeModule }) => {
			const routeSource = fs.readFileSync(path.join(srcRoot, 'routes', `${routeModule}.js`), 'utf8')

			return Array.from(routeSource.matchAll(/\w+\.(get|post|put|delete|patch)\((['"])([^'"]+)\2,\s*([^)]+)\)/g), (match) => ({
				method: match[1],
				path: normalizePath(basePath, match[3]),
				isProtected: match[4].includes('authMiddleware'),
			}))
		})
		.sort((left, right) => left.path.localeCompare(right.path) || left.method.localeCompare(right.method))
}

const discoveredRoutes = getDiscoveredRoutes()
const publicRoutes = discoveredRoutes.filter((route) => !route.isProtected)
const protectedRoutes = discoveredRoutes.filter((route) => route.isProtected)

describe('public auth routes', () => {
	it.each(publicRoutes)('$method $path does not require auth middleware', async ({ method, path }) => {
		const response = await request(app)[method](path).send({})

		logIfVerbose(
			`Testing ${method.toUpperCase()} ${path} - Status: ${response.status}, Body:`,
			response.body,
		)
		expect(response.status).not.toBe(401)
		expect(response.body.code).not.toBe('AUTH_NO_TOKEN_PROVIDED')
	})
})

describe('protected routes', () => {
	it.each(
		protectedRoutes.map((route, index) => ({
			...route,
			ipAddress: `203.0.113.${index + 1}`,
		})),
	)('$method $path requires auth', async ({ method, path, ipAddress }) => {
		const response = await request(app)[method](path).set('x-forwarded-for', ipAddress).send({})

		logIfVerbose(
			`Testing ${method.toUpperCase()} ${path} - Status: ${response.status}, Body:`,
			response.body,
		)
		expect(response.status).toBe(401)
		expect(response.body).toEqual({ code: 'AUTH_NO_TOKEN_PROVIDED' })
	})
})

describe('route discovery', () => {
	it('keeps only login and register as public routes', () => {
		expect(publicRoutes.map((route) => `${route.method.toUpperCase()} ${route.path}`)).toEqual(['POST /v1/auth/login', 'POST /v1/auth/register'])
	})
})

describe('not found', () => {
	it('returns NOT_FOUND for unknown routes', async () => {
		const response = await request(app).get('/v1/does-not-exist')

		expect(response.status).toBe(404)
		expect(response.body).toEqual({ code: 'NOT_FOUND' })
	})
})
