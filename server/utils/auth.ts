import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Définition de l'interface du payload stocké dans le JWT
export interface TokenPayload {
  userId: number
  email?: string
  role?: string
}

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