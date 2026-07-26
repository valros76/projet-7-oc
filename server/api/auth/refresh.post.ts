import { userRepository } from '@server/repositories/userRepository'
import { verifyRefreshToken, generateAccessToken } from '@server/utils/auth'
import { parseCookies } from 'h3'

export default defineEventHandler(async (event) => {
  // 1. Essayer de récupérer le cookie avec getCookie, sinon parser manuellement l'en-tête brut par sécurité
  let refreshToken = getCookie(event, 'refresh_token')
  
  if (!refreshToken) {
    const cookies = parseCookies(event)
    refreshToken = cookies.refresh_token
  }

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Jeton de rafraîchissement manquant.',
    })
  }

  const payload = verifyRefreshToken(refreshToken)
  if (!payload || !payload.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Jeton de rafraîchissement invalide ou expiré.',
    })
  }

  const storedToken = await userRepository.findRefreshToken(refreshToken)
  if (!storedToken) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Jeton de rafraîchissement révoqué.',
    })
  }

  const user = await userRepository.findById(payload.userId)
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Utilisateur introuvable.',
    })
  }

  const newTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const accessToken = generateAccessToken(newTokenPayload)

  return {
    success: true,
    accessToken,
  }
})