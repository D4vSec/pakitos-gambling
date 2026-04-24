import request from 'supertest'

import { getDiscoveredRoutes } from '../helpers/routeDiscovery.js'
import app from '../../src/app.js'

const discoveredRoutes = getDiscoveredRoutes()
const publicRoutes = discoveredRoutes.filter((route) => !route.isProtected)
const protectedRoutes = discoveredRoutes.filter((route) => route.isProtected)

describe('public auth routes', () => {
	it.each(publicRoutes)('$method $path does not require auth middleware', async ({ method, path }) => {
		const response = await request(app)[method](path).send({})
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
