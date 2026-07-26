import { verifyAccessToken } from '@server/utils/auth'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  const protectedRoutes = ['/api/protected', '/api/user/profile', '/api/leads']

  const isProtected = protectedRoutes.some((route) => url.pathname.startsWith(route))

  if (!isProtected) {
    return // La route est publique, on laisse passer
  }

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Accès non autorisé : Token manquant.',
    })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Accès non autorisé : Format du token invalide.',
    })
  }
  const payload = verifyAccessToken(token)
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Accès non autorisé : Token invalide ou expiré.',
    })
  }

  event.context.auth = payload
})