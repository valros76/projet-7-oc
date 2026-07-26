import { describe, it, expect } from 'vitest'
import { 
  hashPassword, 
  verifyPassword, 
  generateAccessToken, 
  verifyAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  protectRoute
} from '../../server/utils/auth'

describe('Auth Security & Token Utils', () => {
  it('should hash a password and verify it successfully', async () => {
    const rawPassword = 'SuperSecurePassword123!'
    const hashed = await hashPassword(rawPassword)

    // Le mot de passe haché ne doit pas être en clair
    expect(hashed).not.toBe(rawPassword)

    // La vérification doit réussir avec le bon mot de passe
    const isValid = await verifyPassword(rawPassword, hashed)
    expect(isValid).toBe(true)
  })

  it('should fail verification on incorrect password', async () => {
    const rawPassword = 'SuperSecurePassword123!'
    const hashed = await hashPassword(rawPassword)

    // La vérification doit échouer avec un mauvais mot de passe
    const isValid = await verifyPassword('WrongPassword', hashed)
    expect(isValid).toBe(false)
  })

  it('should generate and verify an Access Token correctly', () => {
    const payload = { userId: 42, email: 'test@webdevoo.com', role: 'referrer' }
    
    // Génération
    const token = generateAccessToken(payload)
    expect(token).toBeTypeOf('string')

    // Vérification
    const decoded = verifyAccessToken(token)
    expect(decoded).not.toBeNull()
    expect(decoded?.userId).toBe(42)
    expect(decoded?.email).toBe('test@webdevoo.com')
  })

  it('should generate and verify a Refresh Token correctly', () => {
    const userId = 77
    
    // Génération à partir d'un simple ID numérique
    const token = generateRefreshToken(userId)
    expect(token).toBeTypeOf('string')

    // Vérification
    const decoded = verifyRefreshToken(token)
    expect(decoded).not.toBeNull()
    expect(decoded?.userId).toBe(77)
  })

  it('should return null on invalid or corrupted token', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.corrupted.token'

    const accessResult = verifyAccessToken(invalidToken)
    expect(accessResult).toBeNull()

    const refreshResult = verifyRefreshToken(invalidToken)
    expect(refreshResult).toBeNull()
  })

  it('should protect a route successfully with a valid Bearer token', () => {
    const token = generateAccessToken({ userId: 1, email: 'admin@webdevoo.com', role: 'referrer' })
    
    // Simulation d'un événement H3 minimaliste avec l'en-tête Authorization
    const mockEvent = {
      node: {
        req: {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      }
    } as any

    const payload = protectRoute(mockEvent)
    expect(payload).not.toBeNull()
    expect(payload.userId).toBe(1)
  })

  it('should throw an error on protectRoute when token is missing or malformed', () => {
    const mockEventWithoutHeader = {
      node: { req: { headers: {} } }
    } as any

    // Vérifie que l'absence de header lève une erreur HTTP 401
    expect(() => protectRoute(mockEventWithoutHeader)).toThrow()
  })

  it('should throw an error on protectRoute when token is missing after Bearer', () => {
    const mockEventMalformed = {
      node: {
        req: {
          headers: {
            authorization: 'Bearer '
          }
        }
      }
    } as any

    expect(() => protectRoute(mockEventMalformed)).toThrow()
  })

  it('should throw an error on protectRoute when token is invalid or expired', () => {
    const mockEventInvalidToken = {
      node: {
        req: {
          headers: {
            authorization: 'Bearer invalid.jwt.token.string'
          }
        }
      }
    } as any

    expect(() => protectRoute(mockEventInvalidToken)).toThrow()
  })

  it('should fallback to process.env or default when runtimeConfig is unavailable', () => {
    // Forcer temporairement process.env
    const originalEnv = process.env.JWT_ACCESS_SECRET
    process.env.JWT_ACCESS_SECRET = 'custom-env-secret-key'

    const token = generateAccessToken(99)
    const payload = verifyAccessToken(token)
    
    expect(payload?.userId).toBe(99)

    // Nettoyage
    process.env.JWT_ACCESS_SECRET = originalEnv
  })

  it('should cover all fallback branches for jwt and refresh secrets', () => {
    const originalSecret = process.env.JWT_SECRET
    const originalRefresh = process.env.JWT_REFRESH_SECRET

    process.env.JWT_SECRET = 'fallback-jwt-secret'
    process.env.JWT_REFRESH_SECRET = 'fallback-refresh-secret'

    const token = generateRefreshToken(100)
    const payload = verifyRefreshToken(token)
    expect(payload?.userId).toBe(100)

    process.env.JWT_SECRET = originalSecret
    process.env.JWT_REFRESH_SECRET = originalRefresh
  })
})