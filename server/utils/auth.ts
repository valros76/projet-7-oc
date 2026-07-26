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

// Générer un Access Token (courte durée : 15 minutes)
export function generateAccessToken(payload: TokenPayload | number): string {
  const config = useRuntimeConfig()
  const data = typeof payload === 'number' ? { userId: payload } : payload
  return jwt.sign(data, config.jwtAccessSecret, { expiresIn: '15m' })
}

// Générer un Refresh Token (longue durée : 7 jours)
export function generateRefreshToken(payload: TokenPayload | number): string {
  const config = useRuntimeConfig()
  const data = typeof payload === 'number' ? { userId: payload } : payload
  return jwt.sign(data, config.jwtRefreshSecret, { expiresIn: '7d' })
}

// Vérifier un Access Token
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const config = useRuntimeConfig()
    return jwt.verify(token, config.jwtAccessSecret) as TokenPayload
  } catch {
    return null
  }
}

// Vérifier un Refresh Token
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const config = useRuntimeConfig()
    return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload
  } catch {
    return null
  }
}

// Protéger une route API (extrait et valide l'Access Token depuis les headers)
export function protectRoute(event: H3Event): TokenPayload {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
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