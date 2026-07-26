import { userRepository } from '@server/repositories/userRepository'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  if (refreshToken) {
    await userRepository.deleteRefreshToken(refreshToken)
  }

  deleteCookie(event, 'refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  return {
    success: true,
    message: 'Déconnexion réussie.',
  }
})