import { userRepository } from '@server/repositories/userRepository'
import { verifyPassword, generateAccessToken, generateRefreshToken } from '@server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email et mot de passe requis.',
    })
  }

  const user = await userRepository.findByEmail(email)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Identifiants invalides.',
    })
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Identifiants invalides.',
    })
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const accessToken = generateAccessToken(tokenPayload)
  const refreshToken = generateRefreshToken(tokenPayload)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await userRepository.saveRefreshToken(user.id, refreshToken, expiresAt)

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  })

  return {
    success: true,
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  }
})