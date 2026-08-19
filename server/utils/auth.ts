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

// Récupération sécurisée et validation du secret Access Token
const getJwtSecret = () => {
  let secret: string | undefined
  try {
    const config = useRuntimeConfig()
    secret = config.jwtAccessSecret || config.jwtSecret || process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
  } catch {
    secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
  }

  const defaultSecret = 'fallback-access-secret-key'

  if (!secret || secret === defaultSecret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("ERREUR CRITIQUE DE SÉCURITÉ : Aucune clé JWT Access robuste n'est définie en production !")
    }
    return defaultSecret
  }

  return secret
}

// Récupération sécurisée et validation du secret Refresh Token
const getRefreshSecret = () => {
  let secret: string | undefined
  try {
    const config = useRuntimeConfig()
    secret = config.jwtRefreshSecret || process.env.JWT_REFRESH_SECRET
  } catch {
    secret = process.env.JWT_REFRESH_SECRET
  }

  const defaultSecret = 'fallback-refresh-secret-key'

  if (!secret || secret === defaultSecret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("ERREUR CRITIQUE DE SÉCURITÉ : Aucune clé JWT Refresh robuste n'est définie en production !")
    }
    return defaultSecret
  }

  return secret
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