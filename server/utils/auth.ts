import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import type { TokenPayload } from '@shared/types'

// Hacher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Vérifier un mot de passe
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Récupération sécurisée du secret Access Token (compatible tests unitaires Vitest)
const getJwtSecret = () => {
  try {
    const config = useRuntimeConfig()
    return config.jwtAccessSecret || config.jwtSecret || process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'fallback-access-secret-key'
  } catch {
    return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'fallback-access-secret-key'
  }
}

// Récupération sécurisée du secret Refresh Token (compatible tests unitaires Vitest)
const getRefreshSecret = () => {
  try {
    const config = useRuntimeConfig()
    return config.jwtRefreshSecret || process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key'
  } catch {
    return process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key'
  }
}

// Générer un Access Token (courte durée : 15 minutes)
export function generateAccessToken(payload: TokenPayload | number): string {
  const secret = getJwtSecret()
  const data = typeof payload === 'number' ? { userId: payload } : payload
  return jwt.sign(data, secret, { expiresIn: '15m' })
}

// Générer un Refresh Token (longue durée : 7 jours)
export function generateRefreshToken(payload: TokenPayload | number): string {
  const secret = getRefreshSecret()
  const data = typeof payload === 'number' ? { userId: payload } : payload
  return jwt.sign(data, secret, { expiresIn: '7d' })
}

// Vérifier un Access Token
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const secret = getJwtSecret()
    return jwt.verify(token, secret) as TokenPayload
  } catch {
    return null
  }
}

// Vérifier un Refresh Token
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const secret = getRefreshSecret()
    return jwt.verify(token, secret) as TokenPayload
  } catch {
    return null
  }
}

// Protéger une route API (extrait et valide l'Access Token depuis les headers)
export function protectRoute(event: H3Event): TokenPayload {
  const headers = event.node?.req?.headers || {}
  const authHeader = headers.authorization || headers.Authorization

  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé : Token manquant ou invalide.',
    })
  }

  const parts = authHeader.split(' ')
  const token = parts[1]

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Non autorisé : Format du token invalide.',
    })
  }

  const payload = verifyAccessToken(token)

  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token expiré ou invalide.',
    })
  }

  return payload
}